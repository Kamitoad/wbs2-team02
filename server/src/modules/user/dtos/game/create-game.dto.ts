// create-game.dto.ts
import { IsInt } from 'class-validator';

export class CreateGameDto {
    @IsInt()
    player1Id: number;

    @IsInt()
    player2Id: number;
}