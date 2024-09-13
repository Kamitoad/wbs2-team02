import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../../../../database/User";
import {Repository} from "typeorm";
import {GamedataGateway} from "../../../admin/gateways/gamedata/gamedata.gateway";
import {Game} from "../../../../database/Game";

@Injectable()
export class QueueService {
    //private intervals: Map<number, NodeJS.Timeout> = new Map();

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Game)
        private gameRepository: Repository<Game>,

        private gamedataGateway: GamedataGateway,
    ) {}

    async join(userId: number): Promise<any> {
        const user = await this.userRepository.findOne({ where: { userId } });

        // Error Handling
        if (!user) {
            throw new NotFoundException('Benutzer nicht gefunden');
        }
        if (user.inQueue) {
            throw new BadRequestException('Nutzer bereits in der Queue');
        }

        if (await this.checkIfInGame(userId)) {
            throw new BadRequestException('Nutzer ist bereits in einem laufenden Spiel');
        }

        // Main part
        user.queueStartTime = new Date(Date.now()).toISOString();
        user.inQueue = true;
        await this.userRepository.save(user);

        //Send to the admin panel that a new user has joined the queue
        this.gamedataGateway.handleJoinQueue(user);

        // Search opponent
        const opponent = await this.findMatches(userId);

        if (opponent) {

            // End queue for both players
            await this.removeFromQueue(user.userId);
            await this.removeFromQueue(opponent.userId);

            // Create new Game between the two players
            const newGame = this.gameRepository.create();
            newGame.player1 = user;  // Vollständiges User-Objekt zuweisen
            newGame.player2 = opponent;  // Vollständiges User-Objekt zuweisen

            // Set the first playerLeft to move
            const randomNum = Math.random()
            if (randomNum < 0.5) {
                newGame.currentPlayer = user.userId
            } else {
                newGame.currentPlayer = opponent.userId
            }

            await this.gameRepository.save(newGame);

            this.gamedataGateway.notifyGameAdded(newGame);

            return {
                opponent: {
                    userName: newGame.player2.userName,
                    userId: newGame.player2.userId,
                    elo: newGame.player2.elo,
                    profilePic: newGame.player2.profilePic,
                },
                currentUser: {
                    userName: newGame.player1.userName,
                    elo: newGame.player1.elo,
                    profilePic: newGame.player1.profilePic,
                },
                gameId: newGame.gameId
            };
        }

        return {
            opponent: null,
            currentUser: {
                userName: user.userName,
                elo: user.elo,
                profilePic: user.profilePic,
            },
            gameId: null
        };
    }

    async checkIfInGame(userId: number): Promise<any> {
        const user = await this.userRepository.findOne({ where: { userId } });

        // Error Handling
        if (!user) {
            throw new NotFoundException('Benutzer nicht gefunden');
        }

        const ongoingGame = await this.gameRepository.findOne({
            where: [
                //TODO Boolean number fix
                { player1: user, hasEnded: false },
                { player2: user, hasEnded: false }
            ]
        });
        return !!ongoingGame;
    }

        async findMatches(userId: number): Promise<User | null> {
        const usersInQueue = await this.userRepository.find({
            where: {inQueue: true},
            order: {queueStartTime: 'ASC'}
        });

        for (const user1 of usersInQueue) {
            if (user1.userId === userId) continue;

            for (const user2 of usersInQueue) {
                if (user1.userId === user2.userId) continue;

                if (Math.abs(user1.elo - user2.elo) < 200) {
                    return user1.userId == userId ? user2 : user1;
                }
            }
        }

        return null;
    }

    async removeFromQueue(userId: number): Promise<void> {
        const user = await this.userRepository.findOne( { where: { userId } });
        if (!user) {
            throw new NotFoundException('Benutzer nicht gefunden');
        }
        if (!user.inQueue) {
            throw new BadRequestException("Nutzer nicht in der Queue");
        }

        user.queueStartTime = null;
        user.inQueue = false;
        await this.userRepository.save(user);

        await this.gamedataGateway.handleLeaveQueue(user.userId);
    }

    async getUserQueueDuration(userId: number): Promise<number> {
        const user = await this.userRepository.findOne( { where: { userId } });
        if (!user?.queueStartTime) {
            throw new NotFoundException('Benutzer ist nicht in der Queue');
        }
        // Waiting time in seconds
        return this.calcQueueDuration(user.queueStartTime);
    }

    /**
     * Calculates the time between now and {queueStartTimeDate} in seconds
     * @param queueStartTimeDate {string}: 2024-01-01T12:30:00.000Z
     */
    calcQueueDuration(queueStartTimeDate: string): number {
        const now = Date.now();
        const queueStartTime = new Date(queueStartTimeDate).getTime();

        return Math.floor((now - queueStartTime) / 1000);
    }

    // May be not needed, time could be calculated on clients side
    /*
    async updateQueueTime(userId: number) {

        const timeInQueue = this.getUserQueueDuration(userId);
        this.queueGateway.sendQueueTime(userId, timeInQueue);
    }
    */
}
