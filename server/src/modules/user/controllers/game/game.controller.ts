import {
    Controller,
    Param,
    Body,
    NotFoundException,
    BadRequestException,
    ParseIntPipe,
    Get, Session, UseGuards, ConflictException, InternalServerErrorException, Patch
} from '@nestjs/common';
import { GameService } from '../../services/game/game.service';
import {GameDto} from "../../dtos/game/GameDto";
import {SessionData} from "express-session";
import {IsLoggedInGuard} from "../../../../common/guards/is-logged-in/is-logged-in.guard";
import {
    ApiBadRequestResponse,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags
} from "@nestjs/swagger";
import {ErrorDto} from "../../../../common/dtos/auth/ErrorDto";
import {MakeMoveDto} from "../../dtos/MakeMoveDto";

@ApiTags('Game')
@UseGuards(IsLoggedInGuard)
@Controller('game')
export class GameController {
    constructor(private readonly gameService: GameService) {}

    // Route für den Spielzug
    @ApiOperation({ summary: 'Lädt die Daten eines Spiel an dem der Benutzer teilnimmt' })
    @ApiOkResponse({
        type: GameDto,
        description: 'Spieldaten wurden erfolgreich geladen'
    })
    @ApiBadRequestResponse({
        type: ErrorDto,
        description: 'Ist kein Mitspieler oder Spiel ist vorbei',
        example: {
            "statusCode": 400,
            "error": "Bad Request",
            "message": "Spiel ist vorbei"
        }
    })
    @ApiNotFoundResponse({
        type: ErrorDto,
        description: 'Spiel nicht gefunden',
        example: {
            "statusCode": 404,
            "error": "Not Found",
            "message": "Spiel nicht gefunden"
        }
    })
    @ApiInternalServerErrorResponse({
        type: ErrorDto,
        description: 'Fehler beim Laden des Spiels',
        example: {
            "statusCode": 500,
            "error": "Bad Request",
            "message": "Fehler beim Laden des Spiels"
        }
    })
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
                throw new InternalServerErrorException("Fehler beim Laden des Spiels");
            }
        }
    }

    // Route für den Spielzug
    @ApiOperation({ summary: 'Führt einen Zug auf dem Spielfeld aus' })
    @ApiOkResponse({
        type: GameDto,
        description: 'Spielzug erfolgreich ausgeführt'
    })
    @ApiBadRequestResponse({
        type: ErrorDto,
        description: 'Ist kein Mitspieler, nicht an der Reihe, Feld belegt oder Spiel ist vorbei',
        example: {
            "statusCode": 400,
            "error": "Bad Request",
            "message": "Spiel ist vorbei"
        }
    })
    @ApiNotFoundResponse({
        type: ErrorDto,
        description: 'Spiel nicht gefunden',
        example: {
            "statusCode": 404,
            "error": "Not Found",
            "message": "Spiel nicht gefunden"
        }
    })
    @ApiInternalServerErrorResponse({
        type: ErrorDto,
        description: 'Fehler bei dem Laden des Spiels',
        example: {
            "statusCode": 500,
            "error": "Bad Request",
            "message": "Fehler bei dem Laden des Spiels"
        }
    })
    @Patch(':gameId/move')
    async makeMove(
        @Param('gameId', ParseIntPipe) gameId: number,
        @Session() session: SessionData,
        @Body() body: MakeMoveDto
    ): Promise<GameDto> {
        try {
            console.log('Move DTO:', body);
            await this.gameService.makeMove(gameId, session.currentUser, body.move);
            const game = await this.gameService.getGameById(gameId);
            return new GameDto(game);
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw new BadRequestException(error.message);
            } else if (error instanceof ConflictException) {
                throw new NotFoundException(error.message);
            } else {
                throw new InternalServerErrorException("Fehler beim Laden des Spiels");
            }
        }
    }

    // needed for resign button
    /*
    // Route für das Aufgeben
    @ApiOperation({ summary: 'Benutzer gibt in einem Spiel auf, Gegner gewinnt' })
    @Patch(':gameId/resign')
    @Header('Content-Type', 'application/json')
    async resignGame(
        @Param('gameId') gameId: number,
        @Session() session: SessionData,
        @Body() body:
    ) {
        try {
            await this.gameService.resignGame(gameId, resignDto.playerId);
            const game = await this.gameService.getGameById(gameId);

            // Todo -> muss in gameService
            // WebSocket-Event senden, nachdem der Spieler zurückgetreten ist
            this.gameGateway.server.to(`game_${gameId}`).emit('playerResigned', { playerId: resignDto.playerId })

            return { success: true, game };
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            return { success: false, message: error.message };
        }
    }
    */
}
