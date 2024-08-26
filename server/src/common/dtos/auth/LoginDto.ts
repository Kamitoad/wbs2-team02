import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";

export class LoginDto {
    @ApiProperty( { example: "MaxUserman"})
    @IsString()
    @IsNotEmpty()
    userName: string;

    @ApiProperty( { example: "123123123"})
    @IsString()
    @IsNotEmpty()
    password: string;
}