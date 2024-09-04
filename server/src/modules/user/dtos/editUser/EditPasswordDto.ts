import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";

export class EditPasswordDto {

    @ApiProperty( { example: "AltesPasswort123"})
    @IsString()
    @IsNotEmpty()
    oldPassword: string;

    @ApiProperty( { example: "NeuesPassword456"})
    @IsString()
    @IsNotEmpty()
    newPassword: string;

}