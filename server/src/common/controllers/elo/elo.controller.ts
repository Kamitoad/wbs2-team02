import { Controller, Post, Body } from '@nestjs/common';
import{EloService} from "../../services/user/elo.service";

@Controller('Elo')
export class EloController {
    constructor(private readonly playerService: EloService) {}

    @Post('calculate-elo')
    async calculateElo(
        @Body('user1Id') user1Id: number,
        @Body('user2Id') user2Id: number,
        @Body('gameId') gameId: number,
    ) {
        await this.playerService.calculateNewElo(user1Id, user2Id, gameId);
        return { message: 'Elo-Wertung berechnet und aktualisiert' };
    }
}
