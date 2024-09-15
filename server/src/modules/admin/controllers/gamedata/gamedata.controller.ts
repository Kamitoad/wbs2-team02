import {
    Controller, Get,
    InternalServerErrorException, UseGuards,
} from '@nestjs/common';
import {
    ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags
} from "@nestjs/swagger";
import {ErrorDto} from "../../../../common/dtos/auth/ErrorDto";
import {GamedataService} from "../../services/gamedata/gamedata.service";
import {ReadCurrentGamesDto} from "../../dtos/ReadCurrentGamesDto";
import {ReadQueueForAdminDto} from "../../dtos/ReadQueueForAdminDto";
import {QueueService} from "../../../user/services/queue/queue.service";
import {RolesGuard} from "../../../../common/guards/roles/roles.guard";
import {Roles} from "../../../../common/decorators/roles/roles.decorator";
import {RoleEnum} from "../../../../database/enums/RoleEnum";

@ApiTags('Admin - Gamedata')
@UseGuards(RolesGuard)
@Roles(RoleEnum.Admin)
@Controller('admin/gamedata')
export class GamedataController {
    constructor(
        public readonly gamedataService: GamedataService,
        public readonly queueService: QueueService
    ) {}

    @ApiOperation({ summary: 'Lädt die Daten aller laufenden Spiele' })
    @ApiOkResponse({
        type: ReadCurrentGamesDto,
        description: 'Laufende Spiele wurden geladen',
        example: [
            {
                "gameId": 1,
                "player1UserName": "MaxUserman",
                "player1Elo": 1000,
                "player1ProfilePic": null,
                "player2UserName": "Kamitoad",
                "player2Elo": 1000,
                "player2ProfilePic": null
            },
            {
                "gameId": 2,
                "player1UserName": "FabFim",
                "player1Elo": 950,
                "player1ProfilePic": null,
                "player2UserName": "DimPal",
                "player2Elo": 1025,
                "player2ProfilePic": null
            },
        ],
    })
    @ApiInternalServerErrorResponse({
        type: ErrorDto,
        description: 'Fehler beim Laden laufender Spiele',
        example: {
            "statusCode": 500,
            "error": "Internal Server Error",
            "message": "Fehler beim Laden laufender Spiele"
        }
    })
    @Get('allCurrentGames')
    async getAllCurrentGames(): Promise<ReadCurrentGamesDto[]> {
        try {
            const games = await this.gamedataService.getAllCurrentGames();
            return games.map(game => new ReadCurrentGamesDto(game));
        } catch (error) {
            throw new InternalServerErrorException("Fehler beim Laden der User");
        }
    }

    @ApiOperation({ summary: 'Lädt die Daten aller Nutzer die sich in der Queue befinden' })
    @ApiOkResponse({
        type: ReadQueueForAdminDto,
        description: 'Derzeitige Nutzer in der Queue wurden geladen',
        example: [
            {
                "userId": 1,
                "userName": "MaxUserman",
                "elo": 1000,
                "profilePic": null,
                "queueStartTime": "2024-01-01T12:30:00.000Z"
            },
            {
                "userId": 2,
                "userName": "Kamitoad",
                "elo": 1000,
                "profilePic": null,
                "queueStartTime": "2024-01-01T12:30:30.000Z"
            },
        ],
    })
    @ApiInternalServerErrorResponse({
        type: ErrorDto,
        description: 'Fehler beim Laden derzetiger Nutzer in der Queue',
        example: {
            "statusCode": 500,
            "error": "Internal Server Error",
            "message": "Fehler beim Laden derzeitiger Nutzer in der Queue"
        }
    })
    @Get('queue')
    async getAllUsersInQueue(): Promise<ReadQueueForAdminDto[]> {
        try {
            const users = await this.gamedataService.getAllUsersInQueue();
            console.log(users.map(user => { return new ReadQueueForAdminDto(user) }))
            return users.map(user => { return new ReadQueueForAdminDto(user) });
        } catch (error) {
            throw new InternalServerErrorException("Fehler beim Laden der User");
        }
    }
}
