import {ApiProperty} from "@nestjs/swagger";
import {FieldStateEnum} from "../../../../database/enums/FieldStateEnum";
import {Game} from "../../../../database/Game";

export class FinishedMatchDto {

    @ApiProperty({example: 1})
    gameId: number;

    @ApiProperty({example: 0})
    hasEnded: boolean;

    @ApiProperty({example: 1})
    player1: { userName: string };

    @ApiProperty({example: 2})
    player2: { userName: string };

    @ApiProperty({example: 2})
    field0_0: FieldStateEnum;

    @ApiProperty({example: 2})
    field0_1: FieldStateEnum;

    @ApiProperty({example: 2})
    field0_2: FieldStateEnum;

    @ApiProperty({example: 1})
    field1_0: FieldStateEnum;

    @ApiProperty({example: 1})
    field1_1: FieldStateEnum;

    @ApiProperty({example: 0})
    field1_2: FieldStateEnum;

    @ApiProperty({example: 0})
    field2_0: FieldStateEnum;

    @ApiProperty({example: 0})
    field2_1: FieldStateEnum;

    @ApiProperty({example: 0})
    field2_2: FieldStateEnum;

    @ApiProperty({example: 1})
    winner: number | null;

    @ApiProperty({example: 2})
    loser: number | null;

    @ApiProperty({example: 0})
    isTie: boolean;

    @ApiProperty({example: 10})
    changeEloPlayer1: number;

    @ApiProperty({example: -10})
    changeEloPlayer2: number;

    @ApiProperty({example: 1})
    currentPlayer: number;

    constructor(game: Game) {
        this.gameId = game.gameId;
        this.hasEnded = game.hasEnded;
        this.player1 = { userName: game.player1.userName };
        this.player2 = { userName: game.player2.userName };
        this.field0_0 = game.field0_0;
        this.field0_1 = game.field0_1;
        this.field0_2 = game.field0_2;
        this.field1_0 = game.field1_0;
        this.field1_1 = game.field1_1;
        this.field1_2 = game.field1_2;
        this.field2_0 = game.field2_0;
        this.field2_1 = game.field2_1;
        this.field2_2 = game.field2_2;
        this.winner = game.winner;
        this.loser = game.loser;
        this.isTie = game.isTie;
        this.changeEloPlayer1 = game.changeEloPlayer1;
        this.changeEloPlayer2 = game.changeEloPlayer2;
        this.currentPlayer = game.currentPlayer;
    }
}