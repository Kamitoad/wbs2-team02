import {ApiProperty} from "@nestjs/swagger";

export class MakeMoveDto {

    @ApiProperty({example: { x: 0, y: 1 }})
    move: {
        x: number;
        y: number;
    };
}
