import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from '../../database/Game';
import { User } from '../../database/User';

@Injectable()
export class GameService {
    constructor(
        @InjectRepository(Game)
        private readonly gameRepository: Repository<Game>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async getGameById(id: number): Promise<Game> {
        return this.gameRepository.findOne({ where: { gameId: id }, relations: ['player1', 'player2'] });
    }

    async createGame(player1Id: number, player2Id: number): Promise<Game> {
        const player1 = await this.userRepository.findOne({ where: { userId: player1Id } });
        const player2 = await this.userRepository.findOne({ where: { userId: player2Id } });

        if (!player1 || !player2) {
            throw new Error('One or both players not found');
        }

        const game = new Game();
        game.player1 = player1;
        game.player2 = player2;
        game.currentTurn = Math.random() > 0.5 ? 'player1' : 'player2';
        game.hasEnded = 0;
        game.createdAt = new Date().toISOString();

        return this.gameRepository.save(game);
    }

    async updateGameWithResult(gameId: number, winnerId: number, eloChange: number) {
        const game = await this.gameRepository.findOne({ where: { gameId: gameId }, relations: ['player1', 'player2'] });
        if (game) {
            game.winner = winnerId;
            game.loser = game.player1.userId === winnerId ? game.player2.userId : game.player1.userId;
            game.changeEloPlayer1 = game.player1.userId === winnerId ? eloChange : -eloChange;
            game.changeEloPlayer2 = game.player2.userId === winnerId ? eloChange : -eloChange;
            game.hasEnded = 1;
            return this.gameRepository.save(game);
        }
    }
}