import { Repository } from 'typeorm';
import { Game } from '../../Game';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GameRepository extends Repository<Game> {
    constructor(
        @InjectRepository(Game)
        private readonly repository: Repository<Game>,
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }
    // Erstellt ein neues Spiel
    async createNewGame(): Promise<Game> {
        const newGame = this.gameRepository.create({

        });
        return this.gameRepository.save(newGame);
    }
}
