import { Controller, Post, Get, Put, Param, Body } from '@nestjs/common';
import { GameService } from '../services/game.service';
import { CreateGameDto } from '../dtos/create-game.dto';
import { UpdateGameDto } from '../dtos/update-game.dto';
import { Game } from '../../../database/Game';

@Controller('games')
export class GameController {
    constructor(private readonly gameService: GameService) {}

    @Post()
    async create(@Body() createGameDto: CreateGameDto): Promise<Game> {
        return await this.gameService.create(createGameDto);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Game> {
        return await this.gameService.findOne(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateGameDto: UpdateGameDto,
    ): Promise<Game> {
        return await this.gameService.update(id, updateGameDto);
    }
}
