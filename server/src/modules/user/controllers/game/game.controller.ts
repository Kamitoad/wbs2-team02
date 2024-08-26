import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { GameService } from '../../services/game/game.service';
import { CreateGameDto } from '../../dtos/create-game.dto/create-game.dto';
import { MakeMoveDto } from '../../dtos/make-move.dto/make-move.dto';
import { Game } from '../../../../database/Game';

@Controller('game')
export class GameController {
    constructor(private readonly gameService: GameService) {}

    // Endpunkt zum Erstellen eines neuen Spiels
    @Post()
    async createGame(@Body() createGameDto: CreateGameDto): Promise<Game> {
        return this.gameService.createGame(createGameDto.player1Id, createGameDto.player2Id);
    }

    // Endpunkt zum Ausführen eines Zuges
    @Post('move')
    async makeMove(@Body() makeMoveDto: MakeMoveDto): Promise<Game> {
        return this.gameService.makeMove(makeMoveDto.gameId, makeMoveDto.playerId, makeMoveDto.row, makeMoveDto.col);
    }

    // Endpunkt zum Abfragen des aktuellen Spielstatus
    @Get(':id')
    async getGameState(@Param('id') gameId: number): Promise<Game> {
        return this.gameService.getGameState(gameId);
    }
}
