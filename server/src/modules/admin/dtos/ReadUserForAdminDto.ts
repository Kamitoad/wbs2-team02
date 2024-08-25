import {ApiProperty} from "@nestjs/swagger";

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
}