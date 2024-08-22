import {
    BadRequestException,
    Body, ConflictException, Controller, InternalServerErrorException, NotFoundException, Post, Session, UseGuards
} from '@nestjs/common';
import { SessionData } from "express-session";
import {CreateUserDto} from "../../dtos/auth/CreateUserDto";
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {OkDto} from "../../dtos/OkDto";
import {AuthService} from "../../services/auth/auth.service";
import {LoginDto} from "../../dtos/auth/LoginDto";
import {IsLoggedInGuard} from "../../guards/is-logged-in/is-logged-in.guard";

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
    ): Promise<OkDto> {
        try {
            const user = await this.authService.register(body);
            session.currentUser = user.userId;
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
    async login(
        @Session() session: SessionData,
        @Body() body: LoginDto,
    ): Promise<OkDto> {
        try {
            const user = await this.authService.login(body);
            session.currentUser = user.userId;
            return new OkDto(true, 'User erfolgreich eingeloggt');
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            } else {
                throw new InternalServerErrorException( "Fehler bei der Anmeldung");
            }
        }
    }
    @Post('logout')
    @UseGuards(IsLoggedInGuard)
    logout(@Session() session: SessionData): OkDto {
        session.currentUser = undefined;
        return new OkDto(false, 'User erfolgreich ausgeloggt');
    }
}