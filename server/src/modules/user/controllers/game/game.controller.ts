import {
    Controller,
    Post,
    Param,
    Body,
    NotFoundException,
    BadRequestException,
    ParseIntPipe,
    Header,
    Get, Session, UseGuards, ConflictException, InternalServerErrorException
} from '@nestjs/common';
import { GameService } from '../../services/game/game.service';
import {GameDto} from "../../dtos/game/GameDto";
import {SessionData} from "express-session";
import {IsLoggedInGuard} from "../../../../common/guards/is-logged-in/is-logged-in.guard";

@UseGuards(IsLoggedInGuard)
@Controller('game')
export class GameController {
    constructor(private readonly gameService: GameService) {}

    // Route für den Spielzug
    @Get(':gameId')
    async getGame(
        @Session() session: SessionData,
        @Param('gameId', ParseIntPipe) gameId: number,
    ): Promise<GameDto> {
        try {
            const game = await this.gameService.getGame(gameId, session.currentUser);
            return new GameDto(game);
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw new BadRequestException(error.message);
            } else if (error instanceof ConflictException) {
                throw new NotFoundException(error.message);
            } else {
                throw new InternalServerErrorException("Fehler bei der Registrierung");
            }
        }
    }

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
