import { Controller, Get, Post, Put, Param, Body, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';
import { GameService } from './game.service';
import { Game } from '../../database/Game';
// import { GameEntity } from './game.entity';

@ApiTags('games') // Swagger-Dekorator für Gruppierung
@Controller('games') // Die Route wird unter /api/games verfügbar sein
export class GameController {
    constructor(private readonly gameService: GameService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new game' }) // Swagger-Beschreibung
    @ApiBody({ type: Game }) // Swagger erwartet ein Game-Objekt im Request-Body
    @ApiResponse({ status: 201, description: 'The game has been successfully created.', type: Game })
    /*async createGame(@Body() createGameDto: { player1Id: number; player2Id: number }): Promise<GameEntity> {
        return this.gameService.createGame(createGameDto.player1Id, createGameDto.player2Id);
    }
    */
    async createGame(@Body() createGameDto: { player1Id: number; player2Id: number }): Promise<Game> {
        return this.gameService.createGame(createGameDto.player1Id, createGameDto.player2Id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a game by ID' }) // Swagger-Beschreibung
    @ApiParam({ name: 'id', type: 'number' }) // Swagger erwartet eine ID als Parameter
    @ApiResponse({ status: 200, description: 'The game record', type: Game })
    @ApiResponse({ status: 404, description: 'Game not found' })
    async getGameById(@Param('id') id: number): Promise<Game> {
        const game = await this.gameService.getGameById(id);
        if (!game) {
            throw new NotFoundException('Game not found');
        }
        return game;
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a game with result' }) // Swagger-Beschreibung
    @ApiParam({ name: 'id', type: 'number' }) // Swagger erwartet eine ID als Parameter
    @ApiBody({ type: Game }) // Swagger erwartet ein Game-Objekt im Request-Body
    @ApiResponse({ status: 200, description: 'The game has been successfully updated.', type: Game })
    @ApiResponse({ status: 404, description: 'Game not found' })
    async updateGame(
        @Param('id') id: number,
        @Body() updateData: Partial<Game>,
    ): Promise<Game> {
        const game = await this.gameService.getGameById(id);
        if (!game) {
            throw new NotFoundException('Game not found');
        }
        return this.gameService.updateGameWithResult(id, updateData.winner, updateData.changeEloPlayer1);
    }
}
