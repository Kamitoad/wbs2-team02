import { Controller, Post, Body, Param, Get, NotFoundException, BadRequestException } from '@nestjs/common';
import { GameService } from '../../services/game/game.service';
import { CreateGameDto } from '../../dtos/game/create-game.dto';
import { MakeMoveDto } from '../../dtos/game/make-move.dto';
import { Game } from '../../../../database/Game';

@Controller('games')
export class GameController {
    constructor(private readonly gameService: GameService) {}

    @Post('create')
    async createGame(@Body() createGameDto: CreateGameDto): Promise<Game> {
        try {
            return await this.gameService.createGame(createGameDto);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Post(':gameId/move')
    async makeMove(@Param('gameId') gameId: number, @Body() makeMoveDto: MakeMoveDto): Promise<Game> {
        try {
            return await this.gameService.makeMove(gameId, makeMoveDto);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Get(':gameId')
    async getGame(@Param('gameId') gameId: number): Promise<Game> {
        const game = await this.gameService.getGame(gameId);
        if (!game) {
            throw new NotFoundException('Game not found');
        }
        return game;
    }
}
