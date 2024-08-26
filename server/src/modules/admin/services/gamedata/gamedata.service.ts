import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Game} from "../../../../database/Game";

@Injectable()
export class GamedataService {
    constructor(
        @InjectRepository(Game)
        private gameRepository: Repository<Game>,
    ) {
    }

    async getAllCurrentGames(): Promise<Game[]> {
        return await this.gameRepository.find({
            where: { winner: null },
            relations: ['player1', 'player2'] // Relations müssen geladen werden
        });
    }
}
