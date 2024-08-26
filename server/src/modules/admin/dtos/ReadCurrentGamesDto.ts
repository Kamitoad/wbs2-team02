import {ApiProperty} from "@nestjs/swagger";
import {Game} from "../../../database/Game";

export class ReadCurrentGamesDto {
    @ApiProperty({example: "1"})
    gameId: number;

    @ApiProperty({example: "MaxUserman"})
    player1UserName: string;

    @ApiProperty({example: 2006})
    player1Elo: number;

    @ApiProperty({example: "Kamitoad"})
    player2UserName: string;

    @ApiProperty({example: 2002})
    player2Elo: number;

    constructor(game: Game) {
        this.gameId = game.gameId;
        this.player1UserName = game.player1.userName
        this.player1Elo = game.player1.elo
        this.player2UserName = game.player2.userName
        this.player2Elo = game.player2.elo
    }
}