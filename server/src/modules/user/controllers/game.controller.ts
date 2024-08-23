import { Controller, Post, Body } from '@nestjs/common';
import { GameService } from '../services/game.service';
import { CreateGameDto } from '../dtos/create-game.dto';

@Controller('game')
export class GameController {
    constructor(private readonly gameService: GameService) {}

    @Post()
    async createGame(@Body() createGameDto: CreateGameDto) {
        return this.gameService.createGame(createGameDto.player1Id, createGameDto.player2Id);
    }
}