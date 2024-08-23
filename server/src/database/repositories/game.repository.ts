// game.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from '../entities/game.entity';

@Injectable()
export class GameRepository {
    constructor(
        @InjectRepository(Game)
        private readonly repository: Repository<Game>,
    ) {}

    // Beispielmethoden für das GameRepository
    createGame(game: Partial<Game>): Promise<Game> {
        const newGame = this.repository.create(game);
        return this.repository.save(newGame);
    }

    findOne(gameId: number): Promise<Game> {
        return this.repository.findOne({ where: { gameId } });
    }

    // Weitere Methoden hier hinzufügen
}
