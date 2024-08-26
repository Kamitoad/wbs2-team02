import {ApiProperty} from "@nestjs/swagger";
import {User} from "../../../database/User";

export class ReadUserForAdminDto {
    @ApiProperty({example: "1"})
    userId: number;

    @ApiProperty({example: "MaxUserman"})
    userName: string;

    @ApiProperty({example: "max@mustermann.de"})
    email: string;

    @ApiProperty({example: "user"})
    role: string;

    @ApiProperty({example: "Max"})
    firstName: string;

    @ApiProperty({example: "Mustermann"})
    lastName: string;

    @ApiProperty({example: 1000})
    elo: number;

    @ApiProperty({example: "maxPb.png"})
    profilePic: string;

    @ApiProperty({example: 20})
    totalWins: number;

    @ApiProperty({example: 10})
    totalLosses: number;

    constructor(user: User) {
        this.userId = user.userId;
        this.userName = user.userName;
        this.email = user.email;
        this.role = user.role;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.elo = user.elo;
        this.profilePic = user.profilePic;
        this.totalWins = user.totalWins;
        this.totalLosses = user.totalLosses;
    }
}