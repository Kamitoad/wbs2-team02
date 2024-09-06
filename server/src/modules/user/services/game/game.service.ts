import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from '../../../../database/Game';
import { User } from '../../../../database/User'; // Importiere User, um die Spieler zu setzen
import { FieldStateEnum } from '../../../../database/enums/FieldStateEnum';

@Injectable()
export class GameService {
    constructor(
        @InjectRepository(Game)
        private gameRepository: Repository<Game>,
        @InjectRepository(User)
        private userRepository: Repository<User>, // Repository für User
    ) {}

    async createGame(player1Id: number, player2Id: number): Promise<Game> {
        // Get the players from the database
        const player1 = await this.userRepository.findOne({ where: { userId: player1Id } });
        const player2 = await this.userRepository.findOne({ where: { userId: player2Id } });

        if (!player1 || !player2) {
            throw new Error('Einer oder beide Spieler existieren nicht');
        }

        // Create a new game
        const newGame = this.gameRepository.create({
            player1,
            player2,
            hasEnded: 0, // Example value for not completed
            // Set all fields to default value
            field1_1: FieldStateEnum.NotFilled,
            field1_2: FieldStateEnum.NotFilled,
            field1_3: FieldStateEnum.NotFilled,
            field2_1: FieldStateEnum.NotFilled,
            field2_2: FieldStateEnum.NotFilled,
            field2_3: FieldStateEnum.NotFilled,
            field3_1: FieldStateEnum.NotFilled,
            field3_2: FieldStateEnum.NotFilled,
            field3_3: FieldStateEnum.NotFilled,
        });

        return this.gameRepository.save(newGame);
    }

    async getGameState(gameId: number): Promise<Game> {
        return this.gameRepository.findOne({ where: { gameId } });
    }

    async makeMove(gameId: number, row: number, col: number, player: string): Promise<void> {
        const game = await this.gameRepository.findOne({ where: { gameId } });
        if (game) {
            // Update the game state with the new move
            game[`field${row + 1}_${col + 1}`] = player;
            await this.gameRepository.save(game);
        }
    }

    async isGameEnded(gameId: number): Promise<boolean> {
        const game = await this.gameRepository.findOne({ where: { gameId } });
        if (game) {
            return game.hasEnded === 1; // assumption: 1 means finished, 0 means not finished
        }
        return false;
    }
}
