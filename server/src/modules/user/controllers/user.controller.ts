import {
    BadRequestException,
    Body,
    ConflictException,
    Controller,
    Delete,
    Get,
    InternalServerErrorException, NotFoundException, Param,
    Patch, Res,
    Session,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiConsumes, ApiInternalServerErrorResponse, ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {  join } from 'path';
import { SessionData } from 'express-session';
import { ReadUserDto } from '../../../common/dtos/auth/ReadUserDto';
import { UserService } from '../services/user.service';
import { EditPasswordDto } from '../dtos/editUser/EditPasswordDTO';
import { IsLoggedInGuard } from '../../../common/guards/is-logged-in/is-logged-in.guard';
import { AuthService } from '../../../common/services/auth/auth.service';
import { UploadProfilePicDto} from "../dtos/editUser/UploadProfilePicDto";
import {ProfilePicResponseDto} from "../dtos/editUser/ProfilePicResponseDto";
import { Response } from 'express';
import {ErrorDto} from "../../../common/dtos/auth/ErrorDto";
import {FinishedMatchDto} from "../dtos/game/FinishedMatchDto";
import {OkDto} from "../../../common/dtos/OkDto";

@ApiTags('User - Data')
@ApiBearerAuth()
@UseGuards(IsLoggedInGuard)
@Controller('user')
export class UserController {
    constructor(
        public readonly userService: UserService,
        private authService: AuthService
    ) {}

    @ApiOperation({ summary: 'Ändert das Passwort des aktuellen Benutzers' })
    @ApiOkResponse({
        type: OkDto,
        description: 'Das Passwort wurde erfolgreich geändert',
        example: {
            "ok": true,
            "message": "Das Passwort wurde erfolgreich geändert"
        }
    })
    @ApiBadRequestResponse({
        type: ErrorDto,
        description: 'Das alte Passwort ist nicht korrekt',
        example: {
            "statusCode": 400,
            "error": "Bad Request",
            "message": "Das alte Passwort ist nicht korrekt"
        }
    })
    @ApiInternalServerErrorResponse({
        type: ErrorDto,
        description: 'Fehler bei der Änderung des Passwortes',
        example: {
            "statusCode": 500,
            "error": "Internal Server Error",
            "message": "Fehler bei der Änderung des Passwortes"
        }
    })
    @Patch('password')
    async editPassword(
        @Session() session: SessionData,
        @Body() body: EditPasswordDto,
    ): Promise<OkDto> {
        try {
            await this.userService.editPassword(body, session.currentUser);
            return new OkDto(true, 'Das Passwort wurde erfolgreich geändert');
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw new BadRequestException(error.message);
            } else if (error instanceof ConflictException) {
                throw new ConflictException(error.message);
            } else {
                throw new InternalServerErrorException("Fehler bei der Änderung des Passwortes");
            }
        }
    }

    @UseGuards(IsLoggedInGuard)
    @Delete('profilepic')
    @ApiOperation({ summary: 'Löscht das Profilbild des aktuellen Benutzers' })
    @ApiOkResponse({
        type: ProfilePicResponseDto,
        description: 'Das Profilbild wurde erfolgreich gelöscht',
    })
    @ApiInternalServerErrorResponse({
        type: ErrorDto,
        description: 'Fehler beim Löschen des Profilbildes',
        example: {
            "statusCode": 500,
            "error": "Internal Server Error",
            "message": "Fehler beim der Löschen des Profilbildes"
        }
    })
    async deleteProfilePic(
        @Session() session: SessionData,
    ): Promise<ProfilePicResponseDto> {
        try {
            const user: number = session.currentUser;
            const userData = await this.userService.deleteProfilePic(user);
            return { newProfilePic: userData.profilePic };
        } catch (error) {
            if (error instanceof ConflictException) {
                throw new ConflictException(error.message);
            } else {
                throw new InternalServerErrorException("Fehler beim Löschen des Profilbildes");
            }
        }
    }


    @UseGuards(IsLoggedInGuard)
    @Get('profilepic')
    @ApiOperation({ summary: 'Ruft das Profilbild des aktuellen Benutzers ab' })
    @ApiOkResponse({
        type: ProfilePicResponseDto,
        description: 'Das Profilbild wurde erfolgreich abgerufen.'
    })
    @ApiNotFoundResponse({
        type: ErrorDto,
        description: 'User nicht gefunden',
        example: {
            "statusCode": 404,
            "error": "Not Found",
            "message": "User nicht gefunden"
        }
    })
    @ApiInternalServerErrorResponse({
        type: ErrorDto,
        description: 'Fehler beim Abrufen des Profilbildes',
        example: {
            "statusCode": 500,
            "error": "Internal Server Error",
            "message": "Fehler beim Abrufen des Profilbildes"
        }
    })
    async getProfilePic(
        @Session() session: SessionData,
    ): Promise<ProfilePicResponseDto> {
        try {
            const user: number = session.currentUser;
            const userData = await this.authService.getUserByUserId(user);
            return { newProfilePic: userData.profilePic };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            } else  if (error instanceof ConflictException) {
                throw new ConflictException(error.message);
            } else {
                throw new InternalServerErrorException("Fehler beim Abrufen des Profilbildes");
            }
        }
    }

    @UseGuards(IsLoggedInGuard)
    @Get('profilepic/user/:userName')
    @ApiOperation({ summary: 'Ruft das Profilbild des angegebenen Benutzers ab' })
    @ApiOkResponse({
        type: ProfilePicResponseDto,
        description: 'Das Profilbild wurde erfolgreich abgerufen.'
    })
    @ApiNotFoundResponse({
        type: ErrorDto,
        description: 'User nicht gefunden',
        example: {
            "statusCode": 404,
            "error": "Not Found",
            "message": "User nicht gefunden"
        }
    })
    @ApiInternalServerErrorResponse({
        type: ErrorDto,
        description: 'Fehler beim Abrufen des Profilbildes',
        example: {
            "statusCode": 500,
            "error": "Internal Server Error",
            "message": "Fehler beim Abrufen des Profilbildes"
        }
    })
    async getProfilePicOfUser(
        @Param('userName') userName: string,
    ): Promise<ProfilePicResponseDto> {
        try {
            const userData = await this.authService.getUserByUserName(userName);
            return { newProfilePic: userData.profilePic };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            } else if (error instanceof ConflictException) {
                throw new ConflictException(error.message);
            } else {
                throw new InternalServerErrorException("Fehler beim Abrufen des Profilbildes");
            }
        }
    }

    @UseGuards(IsLoggedInGuard)
    @Patch('profilepic')
    // saves profilepic in server storage, only accepts pictures with 5Mb or less
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/profilePictures',
            filename: (req, file, cb) => {
                cb(null, file.originalname);
            },
        }),
        limits: { fileSize: 1024 * 1024 * 5 },
    }))
    @ApiOperation({ summary: 'Lädt ein neues Profilbild für den aktuellen Benutzer hoch' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: UploadProfilePicDto })
    @ApiOkResponse({
        type: ProfilePicResponseDto,
        description: 'Das Profilbild wurde erfolgreich hochgeladen'
    })
    @ApiBadRequestResponse({
        type: ErrorDto,
        description: 'Keine Datei oder keine Bilddatei hochgeladen',
        example: {
            "statusCode": 400,
            "error": "Bad Request",
            "message": "Keine Datei hochgeladen"
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
        description: 'Fehler beim Hochladen des Profilbildes',
        example: {
            "statusCode": 500,
            "error": "Internal Server Error",
            "message": "Fehler beim Hochladen des Profilbildes"
        }
    })
    async uploadProfilePic(
        @Session() session: SessionData,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<ProfilePicResponseDto> {
        try {
            const userId: number = session.currentUser;
            const updatedUser = await this.userService.updateProfilePic(userId, file);
            return { newProfilePic: updatedUser.profilePic };
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw new BadRequestException(error.message);
            } else if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            } else {
                throw new InternalServerErrorException("Fehler beim Hochladen des Profilbildes");
            }
        }
    }


    @Get('profilepic/:profilepic')
    @ApiOperation({ summary: 'Lädt ein Profilbild herunter' })
    @ApiParam({
        name: 'profilepic',
        description: 'Der Name der Profilbilddatei',
        example: 'profile-pic.png',
    })
    @ApiOkResponse({
        type: ProfilePicResponseDto,
        description: 'Das Profilbild wurde erfolgreich geladen'
    })
    @ApiBadRequestResponse({
        type: ErrorDto,
        description: 'Ungültige Anforderung oder Datei nicht gefunden',
        example: {
            "statusCode": 400,
            "error": "Bad Request",
            "message": "Ungültige Anforderung oder Datei nicht gefunden"
        }
    })
    @ApiInternalServerErrorResponse({
        type: ErrorDto,
        description: 'Fehler beim Runterladen des Profilbildes',
        example: {
            "statusCode": 500,
            "error": "Internal Server Error",
            "message": "Fehler beim Runterladen des Profilbildes"
        }
    })
    async getImage(@Param('profilepic') profilepic: string, @Res() res: Response) {
        try {
            const imgPath: string = join(
                process.cwd(),
                'uploads',
                'profilePictures',
                profilepic,
            );
            res.sendFile(imgPath);
        } catch (err) {
            throw new BadRequestException(err);
        }
    }

    @ApiOperation({ summary: 'Lädt die Benutzer-Daten des eingeloggten Benutzers' })
    @ApiOkResponse({
        type: ProfilePicResponseDto,
        description: 'Nutzerdaten wurden erfolgreich geladen'
    })
    @ApiNotFoundResponse({
        type: ErrorDto,
        description: 'Benutzer mit der ID {userId} nicht gefunden',
        example: {
            "statusCode": 404,
            "error": "Not Found",
            "message": "Benutzer mit der ID 1 nicht gefunden"
        }
    })
    @ApiInternalServerErrorResponse({
        type: ErrorDto,
        description: 'Fehler beim Laden des derzeitigen Benutzers',
        example: {
            "statusCode": 500,
            "error": "Bad Request",
            "message": "Fehler beim Laden des derzeitigen Benutzers"
        }
    })
    @Get('current')
    async getCurrentUser(
        @Session() session: SessionData,
    ): Promise<ReadUserDto> {
        try {
            return new ReadUserDto(await this.userService.getCurrentUser(session.currentUser));
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            } else if (error instanceof InternalServerErrorException) {
                throw new InternalServerErrorException("Fehler beim Laden des derzeitigen Benutzers");
            }
        }
    }

    @ApiOperation({ summary: 'Lädt die gespielten Matches des Benutzers' })
    @ApiOkResponse({
        type: FinishedMatchDto,
        description: 'Gespielte Matches wurden erfolgreich geladen',
        example: [
            {
                "gameId": 1,
                "hasEnded": true,
                "player1": {
                    "userName": "Kamitoad"
                },
                "player2": {
                    "userName": "MaxUserman"
                },
                "field0_0": 2,
                "field0_1": 2,
                "field0_2": 2,
                "field1_0": 0,
                "field1_1": 0,
                "field1_2": 0,
                "field2_0": 0,
                "field2_1": 1,
                "field2_2": 1,
                "winner": 2,
                "loser": 1,
                "isTie": false,
                "changeEloPlayer1": -9,
                "changeEloPlayer2": 9,
                "currentPlayer": 1
            },
            {
                "gameId": 2,
                "hasEnded": true,
                "player1": {
                    "userName": "Kamitoad"
                },
                "player2": {
                    "userName": "DimPal"
                },
                "field0_0": 1,
                "field0_1": 0,
                "field0_2": 0,
                "field1_0": 2,
                "field1_1": 2,
                "field1_2": 2,
                "field2_0": 2,
                "field2_1": 1,
                "field2_2": 1,
                "winner": 1,
                "loser": 2,
                "isTie": false,
                "changeEloPlayer1": -11,
                "changeEloPlayer2": 11,
                "currentPlayer": 1
            },
        ]
    })
    @ApiNotFoundResponse({
        type: ErrorDto,
        description: 'Benutzer mit der ID {userId} nicht gefunden',
        example: {
            "statusCode": 404,
            "error": "Not Found",
            "message": "Benutzer mit der ID 1 nicht gefunden"
        }
    })
    @ApiInternalServerErrorResponse({
        type: ErrorDto,
        description: 'Fehler beim Laden der gespielten Matches des derzeitigen Benutzers',
        example: {
            "statusCode": 500,
            "error": "Bad Request",
            "message": "Fehler beim Laden der gespielten Matches des derzeitigen Benutzers"
        }
    })
    @Get('matches')
    async getUserMatches(
        @Session() session: SessionData,
    ): Promise<FinishedMatchDto[]> {
        try {
            const games = await this.userService.getUserMatches(session.currentUser);
            return games.map(game => new FinishedMatchDto(game));
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            } else if (error instanceof InternalServerErrorException) {
                throw new InternalServerErrorException("Fehler beim Laden der gespielten Matches des derzeitigen Benutzers");
            }
        }
    }
}