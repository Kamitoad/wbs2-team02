import {ApiProperty} from "@nestjs/swagger";
import {User} from "../../../database/User";

export class ReadQueueForAdminDto {
    @ApiProperty({example: "1"})
    userId: number;

    @ApiProperty({example: "MaxUserman"})
    userName: string;

    @ApiProperty({example: 1000})
    elo: number;

    @ApiProperty( { example: "maxPb.png"})
    profilePic: string;

    @ApiProperty({example: "2024-01-01T12:30:00.000Z"})
    queueStartTime: string;

    constructor(user: User) {
        this.userId = user.userId;
        this.userName = user.userName;
        this.elo = user.elo;
        this.profilePic = user.profilePic;
        this.queueStartTime = user.queueStartTime;
    }
}