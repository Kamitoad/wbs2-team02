import {ApiProperty} from "@nestjs/swagger";

export class ErrorDto {
    @ApiProperty()
    statusCode: number;

    @ApiProperty()
    error: string;

    @ApiProperty()
    message: string;
}