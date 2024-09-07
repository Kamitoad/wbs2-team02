import {ApiProperty} from "@nestjs/swagger";
import {User} from "../../../database/User";

export class ReadUserForQueueDto {

    @ApiProperty({example: "MaxUserman"})
    userName: string;

    @ApiProperty({example: 1000})
    elo: number;

    @ApiProperty({example: "maxPb.png"})
    profilePic: string;

    constructor(user: User) {
        this.userName = user.userName;
        this.elo = user.elo;
        this.profilePic = user.profilePic;
    }
}