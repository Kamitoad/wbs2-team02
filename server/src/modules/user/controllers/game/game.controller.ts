import { Controller, Body, Post, Get, Param, Delete } from '@nestjs/common';
import { GameService } from '../../services/game/game.service';

@Controller('game')
export class GameController {
    constructor(private readonly gameService: GameService) {}

    @Get(':id')
    async getGameById(@Param('id') gameId: number) {
        return await this.gameService.getGameById(gameId);
    }

    @Delete('surrender/:gameId/:userId')
    async resignGame(@Param('gameId') gameId: number, @Param('userId') userId: number) {
        return await this.gameService.resignGame(gameId, userId);
    }

    @Post('endGame')
    async endGame(@Body() { gameId, winnerId, loserId }: { gameId: number, winnerId: number, loserId: number }) {
        return await this.gameService.endGame(gameId, winnerId, loserId);
    }
}