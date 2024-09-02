import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";

export class EditPasswordDTO {

    @ApiProperty( { example: "123456"})
    @IsString()
    @IsNotEmpty()
    oldPassword: string;

    @ApiProperty( { example: "123456"})
    @IsString()
    @IsNotEmpty()
    newPassword: string;

}