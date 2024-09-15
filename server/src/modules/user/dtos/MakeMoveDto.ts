import {ApiProperty} from "@nestjs/swagger";

export class MakeMoveDto {

    @ApiProperty({example: "1"})
    gameId: number;

    @ApiProperty({example: "1"})
    playerId: number;

    @ApiProperty({example: "{ 0, 2 }"})
    move: {
        x: number;
        y: number;
    };
}
