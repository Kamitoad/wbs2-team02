import {Controller, Get, Param} from '@nestjs/common';
import { GameService } from '../../services/game/game.service';

@Controller('game')
export class GameController {
    constructor(private readonly gameService: GameService) {}

    @Get(':id')
    getGameById(@Param('id') gameId: number) {
        return this.gameService.getGameById(gameId);
    }

    // @Delete('surrender/:gameId/')
    // resignGame(@Param('gameId') gameId: number, userId: number) {}

    // @Post('gameId')
    // updateElo(gameId: number) {}
}
