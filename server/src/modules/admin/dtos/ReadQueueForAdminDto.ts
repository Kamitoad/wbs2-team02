import {ApiProperty} from "@nestjs/swagger";
import {User} from "../../../database/User";

export class ReadQueueForAdminDto {
    @ApiProperty({example: "MaxUserman"})
    userName: string;

    @ApiProperty({example: 1000})
    elo: number;

    @ApiProperty({example: 85})
    queueDuration: number;

    constructor(user: User, queueDuration: number) {
        this.userName = user.userName;
        this.elo = user.elo;
        this.queueDuration = queueDuration;
    }
}