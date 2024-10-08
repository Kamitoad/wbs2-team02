import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Game} from "../../../../database/Game";
import {GamedataGateway} from "../../gateways/gamedata/gamedata.gateway";
import {User} from "../../../../database/User";

@Injectable()
export class GamedataService {
    constructor(
        @InjectRepository(Game)
        private gameRepository: Repository<Game>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private gamedataGateway: GamedataGateway,
    ) {
    }

    async getAllCurrentGames(): Promise<Game[]> {
        return await this.gameRepository.find({
            where: { winner: null, hasEnded: false },
            relations: ['player1', 'player2']
        });
    }

    async addGame(game: Game): Promise<Game> {
        const newGame = await this.gameRepository.save(game);
        this.gamedataGateway.notifyGameAdded(newGame);
        return newGame;
    }

    async endGame(gameId: number): Promise<void> {
        const game = await this.gameRepository.findOne({ where: { gameId: gameId } });
        if (game) {
            game.winner = 14; //Test Example
            await this.gameRepository.save(game);
            this.gamedataGateway.notifyGameEnded(gameId);
        }
    }

    async getAllUsersInQueue(): Promise<User[]> {
        return await this.userRepository.find({
            where: { inQueue: true },
        });
    }
}
