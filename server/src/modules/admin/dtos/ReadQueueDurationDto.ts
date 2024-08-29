import {ApiProperty} from "@nestjs/swagger";

export class ReadQueueDurationDto {
    @ApiProperty({example: "85"})
    queueDuration: number;

    constructor(queueDuration: number) {
        this.queueDuration = queueDuration;
    }
}