import {
    BadRequestException,
    Controller, Get,
    InternalServerErrorException,
    NotFoundException,
    Patch,
    Session,
    UseGuards
} from '@nestjs/common';
import {SessionData} from "express-session";
import {QueueService} from "../../services/queue/queue.service";
import {IsLoggedInGuard} from "../../../../common/guards/is-logged-in/is-logged-in.guard";
import {
    ApiBadRequestResponse,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiOkResponse, ApiOperation, ApiTags
} from "@nestjs/swagger";
import {ErrorDto} from "../../../../common/dtos/auth/ErrorDto";
import {OkDto} from "../../../../common/dtos/OkDto";
import {ReadUserForQueueDto} from "../../dtos/ReadUserForQueueDto";
import {User} from "../../../../database/User";

@ApiTags('User - Queue')
@Controller('queue')
export class QueueController {

    constructor(
        public readonly queueService: QueueService
    ) {
    }

    @ApiOperation({ summary: 'Ändert den Status des Benutzers, dass dieser in der Queue ist' })
    @ApiOkResponse({
        description: 'Nutzer erfolgreich der Queue beigetreten und Match gefunden ' +
            '(Wenn kein Match gefunden: opponent: null, gameId: null)',
        type: User,
        example: {
            "opponent": {
                "userName": "MaxUserman",
                "userId": 1,
                "elo": 1000,
                "profilePic": null
            },
            "currentUser": {
                "userName": "Kamitoad",
                "elo": 1000,
                "profilePic": null
            },
            "gameId": 1
        }
    })
    @ApiBadRequestResponse({
        type: ErrorDto,
        description: 'Nutzer bereits in der Queue',
        example: {
            "statusCode": 400,
            "error": "Bad Request",
            "message": "Nutzer bereits in der Queue"
        }
    })
    @ApiNotFoundResponse({
        type: ErrorDto,
        description: 'Benutzer nicht gefunden',
        example: {
            "statusCode": 404,
            "error": "Not Found",
            "message": "Benutzer nicht gefunden"
        }
    })
    @ApiInternalServerErrorResponse({
        type: ErrorDto,
        description: 'Fehler beim Betreten der Queue',
        example: {
            "statusCode": 500,
            "error": "Internal Server Error",
            "message": "Fehler beim Betreten der Queue"
        }
    })
    @Patch('join')
    @UseGuards(IsLoggedInGuard)
    async join(
        @Session() session: SessionData,
    ): Promise<ReadUserForQueueDto[]> {
        try {
            return await this.queueService.join(session.currentUser);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            } else if (error instanceof BadRequestException) {
                throw new BadRequestException(error.message);
            } else if (error instanceof InternalServerErrorException) {
                throw new InternalServerErrorException("Fehler beim Betreten der Queue");
            }
        }
    }

    @ApiOperation({ summary: 'Überprüft, ob sich der Benutzer in einem Game befindet' })
    @ApiOkResponse({
        description: 'Gibt ein "ok: true" zurück, wenn der Nutzer der Queue beitreten darf, sonst "ok: false"',
        example: {
            "ok": false,
            "message": "Nutzer ist bereits in einem laufenden Spiel"
        },
    })
    @ApiNotFoundResponse({
        type: ErrorDto,
        description: 'Benutzer nicht gefunden',
        example: {
            "statusCode": 404,
            "error": "Not Found",
            "message": "Benutzer nicht gefunden"
        }
    })
    @ApiInternalServerErrorResponse({
        type: ErrorDto,
        description: 'Fehler beim Betreten der Queue',
        example: {
            "statusCode": 500,
            "error": "Internal Server Error",
            "message": "Fehler beim Betreten der Queue"
        }
    })
    @Get('checkIfInGame')
    @UseGuards(IsLoggedInGuard)
    async checkIfInGame(
        @Session() session: SessionData,
    ): Promise<OkDto> {
        try {
            const isInGame: boolean = await this.queueService.checkIfInGame(session.currentUser);
            return !isInGame ?
                new OkDto(true, 'Nutzer ist nicht in einem laufenden Spiel') :
                new OkDto(false, 'Nutzer ist bereits in einem laufenden Spiel');
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            } else if (error instanceof InternalServerErrorException) {
                throw new InternalServerErrorException("Fehler beim Betreten der Queue");
            }
        }
    }

    @ApiOperation({ summary: 'Ändert den Status des Benutzers, dass dieser nicht mehr in der Queue ist' })
    @ApiOkResponse({
        type: OkDto,
        description: 'User hat erfolgreich die Queue verlassen'
    })
    @ApiBadRequestResponse({
        type: ErrorDto,
        description: 'Nutzer bereits in der Queue',
        example: {
            "statusCode": 400,
            "error": "Bad Request",
            "message": "Nutzer bereits in der Queue"
        }
    })
    @ApiNotFoundResponse({
        type: ErrorDto,
        description: 'Benutzer nicht gefunden',
        example: {
            "statusCode": 404,
            "error": "Not Found",
            "message": "Benutzer nicht gefunden"
        }
    })
    @ApiInternalServerErrorResponse({
        type: ErrorDto,
        description: 'Fehler beim Verlassen der Queue',
        example: {
            "statusCode": 500,
            "error": "Internal Server Error",
            "message": "Fehler beim Verlassen der Queue"
        }
    })
    @Patch('leave')
    @UseGuards(IsLoggedInGuard)
    async leave(
        @Session() session: SessionData,
    ): Promise<OkDto> {
        try {
            await this.queueService.removeFromQueue(session.currentUser);
            return new OkDto(true, 'User erfolgreich aus der Queue entfernt')
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            } else if (error instanceof BadRequestException) {
                throw new BadRequestException(error.message);
            } else if (error instanceof InternalServerErrorException) {
                throw new InternalServerErrorException("Fehler beim Verlassen der Queue");
            }
        }
    }

    // May be not needed, time could be calculated on clients side
    /*
    @ApiOkResponse({
        type: ReadQueueDurationDto,
        description: 'Wartezeit vom User wird angezeigt'
    })
    @ApiNotFoundResponse({
        type: ErrorDto,
        description: 'Benutzer nicht gefunden'
    })
    @ApiInternalServerErrorResponse({
        type: ErrorDto,
        description: 'Fehler beim Laden der Wartezeit'
    })
    @Get()
    @UseGuards(IsLoggedInGuard)
    async getQueueTime(
        @Session() session: SessionData,
    ): Promise<ReadQueueDurationDto> {
        try {
            const queueDuration = await this.queueService.getUserQueueDuration(session.currentUser)
            return new ReadQueueDurationDto(queueDuration);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            } else if (error instanceof InternalServerErrorException) {
                throw new InternalServerErrorException("Fehler beim auslesen der Queuedauer");
            }
        }
    }*/
}
