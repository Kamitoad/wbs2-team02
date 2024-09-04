import {Controller, Get, Param} from '@nestjs/common';
import{GameService} from '../../services/game/game.service';


@Controller('game')
export class GameController {
    constructor(private readonly gameService:GameService) {}

    @Get(':userId/stats')
    async getStatistics(@Param('userId') userId: number) {
        const stats= await this.gameService.getUserStats(userId);
        return stats;
    }

    @Get(':userId/games')
    async getGames(@Param('userId') userId: number) {
        const games = await this.gameService.getUserGames(userId);
        return { userId, games };
    }
}
