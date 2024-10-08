import {
    BadRequestException,
    Body,
    ConflictException,
    Controller,
    HttpCode,
    InternalServerErrorException,
    NotFoundException,
    Post,
    Session,
    UseGuards
} from '@nestjs/common';
import {SessionData} from "express-session";
import {CreateUserDto} from "../../dtos/auth/CreateUserDto";
import {
    ApiBadRequestResponse, ApiConflictResponse,
    ApiCreatedResponse, ApiForbiddenResponse,
    ApiInternalServerErrorResponse,
    ApiOkResponse, ApiOperation,
    ApiTags,
} from "@nestjs/swagger";
import {OkDto} from "../../dtos/OkDto";
import {AuthService} from "../../services/auth/auth.service";
import {LoginDto} from "../../dtos/auth/LoginDto";
import {IsLoggedInGuard} from "../../guards/is-logged-in/is-logged-in.guard";
import {ErrorDto} from "../../dtos/auth/ErrorDto";
import {ReadUserDto} from "../../dtos/auth/ReadUserDto";

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
    constructor(
        public readonly authService: AuthService
    ) {
    }

    @ApiOperation({ summary: 'Registriert den Benutzer mit den angegebenen Daten' })
    @ApiCreatedResponse({
        type: ReadUserDto,
        description: 'User erfolgreich registriert',
    })
    @ApiBadRequestResponse({
        type: ErrorDto,
        description: 'Validierung fehlgeschlagen',
        example: {
            "statusCode": 400,
            "error": "Bad Request",
            "message": "Validierung fehlgeschlagen"
        }
    })
    @ApiConflictResponse({
        type: ErrorDto,
        description: 'User existiert bereits mit dieser Email oder Usernamen',
        example: {
            "statusCode": 409,
            "error": "Conflict",
            "message": "User existiert bereits mit dieser Email oder Usernamen"
        }
    })
    @ApiInternalServerErrorResponse({
        type: ErrorDto,
        description: 'Fehler bei der Registrierung',
        example: {
            "statusCode": 500,
            "error": "Internal Server Error",
            "message": "Fehler bei der Registrierung"
        }
    })
    @Post('register')
    async register(
        @Session() session: SessionData,
        @Body() body: CreateUserDto,
    ): Promise<ReadUserDto> {
        try {
            const user = await this.authService.register(body);
            session.currentUser = user.userId;
            session.role = user.role
            return new ReadUserDto(user);
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw new BadRequestException(error.message);
            } else if (error instanceof ConflictException) {
                throw new ConflictException(error.message);
            } else {
                throw new InternalServerErrorException("Fehler bei der Registrierung");
            }
        }
    }

    @ApiOperation({ summary: 'Meldet den Benutzer an' })
    @ApiOkResponse({
        type: ReadUserDto,
        description: 'User erfolgreich eingeloggt'
    })
    @ApiBadRequestResponse({
        type: ErrorDto,
        description: 'Email oder Passwort inkorrekt',
        example: {
            "statusCode": 400,
            "error": "Bad Request",
            "message": "Email oder Passwort inkorrekt"
        }
    })
    @ApiInternalServerErrorResponse({
        type: ErrorDto,
        description: 'Fehler bei der Anmeldung',
        example: {
            "statusCode": 500,
            "error": "Internal Server Error",
            "message": "Fehler bei der Anmeldung"
        }
    })
    @Post('login')
    @HttpCode(200)
    async login(
        @Session() session: SessionData,
        @Body() body: LoginDto,
    ): Promise<ReadUserDto> {
        try {
            const user = await this.authService.login(body);
            session.currentUser = user.userId;
            session.role = user.role
            return new ReadUserDto(user);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new BadRequestException("Email oder Passwort inkorrekt");
            } else if (error instanceof BadRequestException) {
                throw new BadRequestException("Email oder Passwort inkorrekt");
            } else {
                throw new InternalServerErrorException("Fehler bei der Anmeldung");
            }
        }
    }

    @ApiOperation({ summary: 'Meldet den Benutzer ab' })
    @ApiOkResponse({
        type: OkDto,
        description: 'User erfolgreich ausgeloggt'
    })
    @ApiForbiddenResponse({
        type: ErrorDto,
        description: 'Error: Forbidden',
        example: {
            "message": "Forbidden resource",
            "error": "Forbidden",
            "statusCode": 403
        }
    })
    @ApiInternalServerErrorResponse({
        type: ErrorDto,
        description: 'Fehler beim Ausloggen des Benutzers',
        example: {
            "message": "Fehler beim Ausloggen des Benutzers",
            "error": "Internal Server Error",
            "statusCode": 500
        }
    })
    @Post('logout')
    @HttpCode(200)
    @UseGuards(IsLoggedInGuard)
    async logout(@Session() session: SessionData): Promise<OkDto> {
        try {
            await this.authService.logout(session.currentUser);
            session.currentUser = undefined;
            return new OkDto(true, 'User erfolgreich ausgeloggt');
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            } else if (error instanceof BadRequestException) {
                throw new BadRequestException(error.message);
            } else if (error instanceof InternalServerErrorException) {
                throw new InternalServerErrorException("Fehler beim Ausloggen des Benutzers");
            }
        }
    }
}