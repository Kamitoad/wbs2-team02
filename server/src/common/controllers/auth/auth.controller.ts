import {
    BadRequestException,
    Body, ConflictException, Controller, InternalServerErrorException, Post, Session,
    UnauthorizedException
} from '@nestjs/common';
import { SessionData } from "express-session";
import {CreateUserDto} from "../../dtos/user/CreateUserDto";
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {OkDto} from "../../dtos/OkDto";
import {AuthService} from "../../services/auth/auth.service";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        public readonly authService: AuthService
    ) {}

    @ApiResponse( {
        type: OkDto,
        description: 'Successfully logged in' })
    @Post('register')
    async register(
        @Session() session: SessionData,
        @Body() body: CreateUserDto,
    ) {
        try {
            const user = await this.authService.register(body);
            if (session) {
                session.currentUser = user.userId;
            }
            return new OkDto(true, 'User erfolgreich registriert');
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw new BadRequestException(error.message);
            } else if (error instanceof ConflictException) {
                throw new ConflictException(error.message);
            } else {
                throw new InternalServerErrorException( "Fehler bei der Registrierung");
            }
        }
    }

    @Post('login')
    login(
        @Session() session: SessionData,
        @Body('username') username: string,
    ): void {
        /*if (username == 'admin') {
            session.isLoggedIn = true;
        } else {
            throw new UnauthorizedException();
        }*/
        session.currentUser = 1;
    }
    @Post('logout')
    logout(@Session() session: SessionData): void {
        session.currentUser = undefined;
    }
}