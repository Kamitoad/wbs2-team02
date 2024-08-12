import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from '../../../database/Game';
import { CreateGameDto } from '../dtos/create-game.dto';
import { UpdateGameDto } from '../dtos/update-game.dto';

@Injectable()
export class GameService {
    constructor(
        @InjectRepository(Game)
        private readonly gameRepository: Repository<Game>,
    ) {}

    async create(createGameDto: CreateGameDto): Promise<Game> {
        const game = this.gameRepository.create(createGameDto);
        return await this.gameRepository.save(game);
    }

    async findOne(id: string): Promise<Game> {
        return await this.gameRepository.findOne({ where: { id } });
    }

    async update(id: string, updateGameDto: UpdateGameDto): Promise<Game> {
        await this.gameRepository.update(id, updateGameDto);
        return this.findOne(id);
    }
}
