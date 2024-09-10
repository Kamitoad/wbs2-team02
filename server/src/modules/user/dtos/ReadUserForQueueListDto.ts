import {ApiProperty} from "@nestjs/swagger";
import {User} from "../../../database/User";
import {ReadUserForQueueDto} from "./ReadUserForQueueDto";

export class ReadUserForQueueListDto {
    @ApiProperty({
        type: [ReadUserForQueueDto],
        example: [
            {
                userName: "Kamitoad",
                elo: 1050,
                profilePic: null
            },
            {
                userName: "FabFim",
                elo: 1150,
                profilePic: null
            }
        ]
    })
    users: ReadUserForQueueDto[];

    constructor(users: User[]) {
        this.users = users.map(user => new ReadUserForQueueDto(user));
    }
}