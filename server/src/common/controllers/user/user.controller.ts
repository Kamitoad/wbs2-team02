import {
    BadRequestException,
    Controller,
    Get,
    UseGuards,
    Session,
    NotFoundException,
    InternalServerErrorException
} from '@nestjs/common';
import {UserService} from 'src/common/services/user/user.service';
import {IsLoggedInGuard} from 'src/common/guards/is-logged-in/is-logged-in.guard';
import {SessionData} from 'express-session';

@Controller('user')
@UseGuards(IsLoggedInGuard)
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Get('current')
    getCurrentUser(
        @Session() session: SessionData,
    ) {
        try {
            const userId = session.currentUser;
            return this.userService.getCurrentUser(userId);
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

    @Get('matches')
    getUserMatches(
        @Session() session: SessionData,
    ) {
        const userId = session.currentUser;
        if (!userId) {
            throw new BadRequestException('User is not authenticated.');
        }
        return this.userService.getUserMatches(userId);
    }
}
