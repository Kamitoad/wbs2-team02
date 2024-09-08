import { Controller, Post, Param, Body, NotFoundException, BadRequestException, ParseIntPipe, Header } from '@nestjs/common';
import { GameService } from '../../services/game/game.service';

@Controller('game')
export class GameController {
    constructor(private readonly gameService: GameService) {}

    // Route für den Spielzug
    @Post(':gameId/move')
    @Header('Content-Type', 'application/json')
    async makeMove(
        @Param('gameId', ParseIntPipe) gameId: number,
        @Body() moveDto: { playerId: number, move: { x: number, y: number } }
    ) {
        console.log('Move DTO:', moveDto);
        if (!moveDto.playerId) {
            throw new BadRequestException('Ungültiger Spieler');
        }
        await this.gameService.makeMove(gameId, moveDto.playerId, moveDto.move);
        const game = await this.gameService.getGameById(gameId);
        return { success: true, game };
    }

    // Route für das Aufgeben
    @Post(':gameId/resign')
    @Header('Content-Type', 'application/json')
    async resignGame(
        @Param('gameId') gameId: number,
        @Body() resignDto: { playerId: number }
    ) {
        try {
            await this.gameService.resignGame(gameId, resignDto.playerId);
            const game = await this.gameService.getGameById(gameId);
            return { success: true, game };
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            return { success: false, message: error.message };
        }
    }
}
