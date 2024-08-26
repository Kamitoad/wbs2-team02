import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from '../../../../database/Game';
import { FieldStateEnum } from '../../../../database/enums/FieldStateEnum';
import { User } from '../../../../database/User'; // Referenz auf die User Entität

@Injectable()
export class GameService {
    makeMove(gameId: number, playerId: number, row: number, col: number): Game | PromiseLike<Game> {
        throw new Error('Method not implemented.');
    }
    constructor(
        @InjectRepository(Game)
        private readonly gameRepository: Repository<Game>,
    ) {}

    async createGame(player1Id: number, player2Id: number): Promise<Game> {
        const game = new Game();
        game.player1 = { userId: player1Id } as User;
        game.player2 = { userId: player2Id } as User;
        game.currentTurn = 'X';

        // Initialisiere das Spielfeld mit leeren Werten
        game.field1_1 = FieldStateEnum.NotFilled;
        game.field1_2 = FieldStateEnum.NotFilled;
        game.field1_3 = FieldStateEnum.NotFilled;
        game.field2_1 = FieldStateEnum.NotFilled;
        game.field2_2 = FieldStateEnum.NotFilled;
        game.field2_3 = FieldStateEnum.NotFilled;
        game.field3_1 = FieldStateEnum.NotFilled;
        game.field3_2 = FieldStateEnum.NotFilled;
        game.field3_3 = FieldStateEnum.NotFilled;

        return this.gameRepository.save(game);
    }

    getGameState(gameId: number) {
        return undefined;
    }
}