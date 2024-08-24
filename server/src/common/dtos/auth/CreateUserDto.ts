import {ApiProperty} from "@nestjs/swagger";
import {IsBoolean, IsEmail, IsNotEmpty, IsString} from "class-validator";

export class CreateUserDto {
    @ApiProperty( { example: "MaxUserman"})
    @IsString()
    @IsNotEmpty()
    userName: string;

    @ApiProperty( { example: "max@mustermann.de"})
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty( { example: "max@mustermann.de"})
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    confirmEmail: string;

    @ApiProperty( { example: "123123123"})
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty( { example: "123123123"})
    @IsString()
    @IsNotEmpty()
    confirmPassword: string;

    @ApiProperty( { example: true})
    @IsBoolean()
    agb: boolean;

    @ApiProperty( { example: "Max"})
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty( { example: "Mustermann"})
    @IsString()
    @IsNotEmpty()
    lastName: string;
}