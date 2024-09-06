import { Controller, Body, Post, Get, Param } from '@nestjs/common';
import { GameService } from '../../services/game/game.service';

@Controller('game')
export class GameController {
    constructor(private readonly gameService: GameService) {}

    @Post('create')
    createGame(@Body() createGameDto: { player1id: number, player2id: number }) {
        return this.gameService.createGame(createGameDto.player1id, createGameDto.player2id);
    }

    @Get(':id')
    getGameState(@Param('id') gameId: number) {
        return this.gameService.getGameState(gameId);
    }
}
