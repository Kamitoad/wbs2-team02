import {
    BadRequestException,
    Controller,
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
    ApiOkResponse, ApiTags
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

    @ApiOkResponse({
        description: 'Nutzer erfolgreich der Queue beigetreten und Match gefunden ' +
            '(Wenn kein Match gefunden: opponent: null, gameId: null) ' +
            '[Faulty Lösung, ganzer User wird ausgegeben, aber nicht anders über Socket möglich]',
        type: User,
        example: {
            "opponent": {
                "userId": 7,
                "userName": "MaxUserman",
                "email": "max@mustermann.de",
                "password": "$2a$10$igNQZxtmmSQ9m63cfIpTTeNuY4pRupkJxhGOlvhEXu7z4La9Qb98O",
                "role": "user",
                "firstName": "Max",
                "lastName": "Mustermann",
                "elo": 1000,
                "profilePic": null,
                "inQueue": true,
                "queueStartTime": "2024-09-05T20:16:30.297Z",
                "totalWins": 0,
                "totalTies": 0,
                "totalLosses": 0
            },
            "currentUser": {
                "userId": 6,
                "userName": "Kamitoad",
                "email": "chmoustafa@hotmail.de",
                "password": "$2a$10$VrM3SG8ndiICVkRAQRx2WeCqHfgpwUI/JfM5KRzenvLzmKKLvB/H2",
                "role": "admin",
                "firstName": "Chasan",
                "lastName": "Moustafa",
                "elo": 1050,
                "profilePic": null,
                "inQueue": true,
                "queueStartTime": "2024-09-05T20:16:42.641Z",
                "totalWins": 0,
                "totalTies": 0,
                "totalLosses": 0
            },
            "gameId": 5
        }
    })
    @ApiNotFoundResponse({
        type: ErrorDto,
        description: 'Benutzer nicht gefunden'
    })
    @ApiBadRequestResponse({
        type: ErrorDto,
        description: 'Nutzer bereits in der Queue'
    })
    @ApiInternalServerErrorResponse({
        type: ErrorDto,
        description: 'Fehler beim Betreten der Queue'
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

    @ApiOkResponse({
        type: OkDto,
        description: 'User hat erfolgreich die Queue verlassen'
    })
    @ApiNotFoundResponse({
        type: ErrorDto,
        description: 'Benutzer nicht gefunden'
    })
    @ApiBadRequestResponse({
        type: ErrorDto,
        description: 'Nutzer bereits in der Queue'
    })
    @ApiInternalServerErrorResponse({
        type: ErrorDto,
        description: 'Fehler beim Verlassen der Queue'
    })
    @Patch('leave')
    @UseGuards(IsLoggedInGuard)
    async leave(
        @Session() session: SessionData,
    ): Promise<void> {
        try {
            await this.queueService.removeFromQueue(session.currentUser)
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
