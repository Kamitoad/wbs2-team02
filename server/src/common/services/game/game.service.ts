import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Game} from "../../../database/Game";

@Injectable()
export class GameService {
    constructor(@InjectRepository(Game)
    private gameRepository: Repository<Game>
    ) {}

    async getUserStats(userId: number): Promise<{ wins: number; losses: number; ties: number }> {
        // Siege zählen
        const winCount = await this.gameRepository.count({
            where: {winner: userId},
        });

        // Niederlagen zählen
        const lossCount = await this.gameRepository.count({
            where: {loser: userId},
        });

        // Unentschieden zählen
        const tieCount = await this.gameRepository.count({
            where: [
                {player1: {userId}, winner: null},
                {player2: {userId}, winner: null}
            ]
        });

        return {
            wins: winCount,
            losses: lossCount,
            ties: tieCount,
        };
    }
}
