import { Injectable } from '@nestjs/common';
import { GameRepository } from '../../../database/repositories/game.repository';
import { UserRepository } from '../../../database/repositories/user.repository';
import { Game } from '../../../database/entities/game.entity';

@Injectable()
export class GameService {
    constructor(
        private readonly gameRepository: GameRepository,
        private readonly userRepository: UserRepository,
    ) {}

    async createGame(player1Id: number, player2Id: number): Promise<Game> {
        const player1 = await this.userRepository.findOne(player1Id);
        const player2 = await this.userRepository.findOne(player2Id);

        const game = this.gameRepository.create({
            player1,
            player2,
            currentTurn: 'X',
        });

        return this.gameRepository.save(game);
    }
}