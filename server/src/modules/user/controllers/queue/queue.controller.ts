import {
    Controller,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Patch,
    Session,
    UseGuards
} from '@nestjs/common';
import {SessionData} from "express-session";
import {QueueService} from "../../services/queue/queue.service";
import {IsLoggedInGuard} from "../../../../common/guards/is-logged-in/is-logged-in.guard";

@Controller('queue')
export class QueueController {
    constructor(
        public readonly queueService: QueueService
    ) {
    }

    @Patch('join')
    @UseGuards(IsLoggedInGuard)
    async join(
        @Session() session: SessionData,
    ): Promise<void> {
        try {
            await this.queueService.addToQueue(session.currentUser)
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            } else if (error instanceof InternalServerErrorException) {
                throw new InternalServerErrorException("Fehler beim Betreten der Queue");
            }
        }
    }

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
            } else if (error instanceof InternalServerErrorException) {
                throw new InternalServerErrorException("Fehler beim Verlassen der Queue");
            }
        }
    }

    @Get()
    @UseGuards(IsLoggedInGuard)
    async getQueueTime(
        @Session() session: SessionData,
    ): Promise<any> {
        try {
            return await this.queueService.getUserQueueDuration(session.currentUser)
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            } else if (error instanceof InternalServerErrorException) {
                throw new InternalServerErrorException("Fehler beim auslesen der Queuedauer");
            }
        }
    }
}
