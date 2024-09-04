import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../../../../database/User";
import {Repository} from "typeorm";
import {GamedataGateway} from "../../../admin/gateways/gamedata/gamedata.gateway";
import {QueueGateway} from "../../gateways/queue/queue.gateway";
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
        private queueGateway: QueueGateway,
    ) {}

    async join(userId: number): Promise<User> {
        const user = await this.userRepository.findOne( { where: { userId } });

        // Error Handling
        if (!user) {
            throw new NotFoundException('Benutzer nicht gefunden');
        }
        if (user.inQueue) {
            throw new BadRequestException("Nutzer bereits in der Queue");
        }

        const ongoingGame = await this.gameRepository.findOne({
            where: [
                { player1: user, hasEnded: 0 },
                { player2: user, hasEnded: 0 }
            ]
        });
        if (ongoingGame) {
            throw new BadRequestException('Nutzer ist bereits in einem laufenden Spiel');
        }

        // Main part
        user.queueStartTime = new Date(Date.now()).toISOString();
        user.inQueue = true;
        await this.userRepository.save(user);

        //Send to the admin panel that a new user has joined the queue
        await this.gamedataGateway.handleJoinQueue(user);

        return await this.findMatches(userId);
    }

    //Comments are for the purpose, that multiple matches can be found.
    //Only useful when changes to a user in directly database is done
    async findMatches(userId: number):Promise<User> {
        const usersInQueue = await this.userRepository.find({
            where: { inQueue: true },
            order: { queueStartTime: 'ASC'}
        });

        //const matchedUsers = new Set<number>();

        for (const curUser1 of usersInQueue) {
            const user1: User = curUser1;

            //if (matchedUsers.has(user1.userId)) continue;

            for (const curUser2 of usersInQueue) {
                const user2: User = curUser2;

                //if (matchedUsers.has(user2.userId)) continue;

                if (user1.userId === user2.userId) continue;

                if (Math.abs(user1.elo - user2.elo) < 200) {
                    //matchedUsers.add(user1.userId);
                    //matchedUsers.add(user2.userId);

                    const newGame: Game = this.gameRepository.create();
                    newGame.player1 = user1;
                    newGame.player2 = user2;

                    await this.gameRepository.save(newGame);

                    this.gamedataGateway.notifyGameAdded(newGame);

                    await this.gamedataGateway.handleLeaveQueue(user1);
                    await this.gamedataGateway.handleLeaveQueue(user2);

                    await this.userRepository.update(user1.userId, { inQueue: false, queueStartTime: null });
                    await this.userRepository.update(user2.userId, { inQueue: false, queueStartTime: null });

                    return user1.userId == userId ? user2 : user1;
                    //break; instead of return;
                }
            }
        }
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

        await this.gamedataGateway.handleLeaveQueue(user);
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
