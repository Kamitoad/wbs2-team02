import {
    BadRequestException,
    Body,
    ConflictException,
    Controller,
    Delete,
    Get,
    InternalServerErrorException,
    Param,
    Patch,
    Res,
    Session,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { SessionData } from 'express-session';
import { ReadUserDto } from '../../../common/dtos/auth/ReadUserDto';
import { UserService } from '../services/user.service';
import { IsLoggedInGuard } from '../../../common/guards/is-logged-in/is-logged-in.guard';
import { UploadProfilePicDto } from "../dtos/editUser/UploadProfilePicDto";
import { ProfilePicResponseDto } from "../dtos/editUser/ProfilePicResponseDto";
import { Response } from 'express';
import {EditPasswordDto} from "../dtos/editUser/EditPasswordDto";

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
    constructor(
        public readonly userService: UserService,
    ) {}

    @UseGuards(IsLoggedInGuard)
    @Patch('password')
    @ApiOperation({ summary: 'Ändert das Passwort des aktuellen Benutzers' })
    @ApiResponse({ status: 200, description: 'Das Passwort wurde erfolgreich geändert.', type: ReadUserDto })
    @ApiResponse({ status: 400, description: 'Das alte Passwort ist nicht korrekt.' })
    @ApiResponse({ status: 500, description: 'Interner Serverfehler' })
    async editPassword(
        @Session() session: SessionData,
        @Body() body: EditPasswordDto,
    ): Promise<ReadUserDto> {
        try {
            const userId: number = session.currentUser;
            const updatedUser = await this.userService.editPassword(body, userId);
            return new ReadUserDto(updatedUser);
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof ConflictException) {
                throw error;
            } else {
                throw new InternalServerErrorException("Fehler bei der Änderung");
            }
        }
    }

    @UseGuards(IsLoggedInGuard)
    @Delete('profilepic')
    @ApiOperation({ summary: 'Löscht das Profilbild des aktuellen Benutzers' })
    @ApiResponse({ status: 200, description: 'Das Profilbild wurde erfolgreich gelöscht.', type: ReadUserDto })
    @ApiResponse({ status: 500, description: 'Interner Serverfehler' })
    async deleteProfilePic(
        @Session() session: SessionData,
    ): Promise<ReadUserDto> {
        try {
            const userId: number = session.currentUser;
            const userData = await this.userService.deleteProfilePic(userId);
            return new ReadUserDto(userData);
        } catch (error) {
            throw new InternalServerErrorException("Fehler beim Löschen des Profilbildes");
        }
    }

    @UseGuards(IsLoggedInGuard)
    @Patch('profilepic')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/profilePictures',
            filename: (req, file, cb) => {
                cb(null, file.originalname); // Behalte den ursprünglichen Dateinamen bei
            },
        }),
        limits: { fileSize: 1024 * 1024 * 5 }, // Limit der Datei auf 5 MB
    }))
    @ApiOperation({ summary: 'Lädt ein neues Profilbild für den aktuellen Benutzer hoch' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: UploadProfilePicDto })
    @ApiResponse({ status: 200, description: 'Das Profilbild wurde erfolgreich hochgeladen.', type: ProfilePicResponseDto })
    @ApiResponse({ status: 400, description: 'Ungültige Datei. Nur Bilddateien sind erlaubt.' })
    @ApiResponse({ status: 500, description: 'Interner Serverfehler' })
    async uploadProfilePic(
        @Session() session: SessionData,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<ProfilePicResponseDto> {
        try {
            if (!file) {
                throw new BadRequestException('Keine Datei hochgeladen');
            }

            const userId: number = session.currentUser;
            const updatedUser = await this.userService.updateProfilePic(userId, file);
            return { newProfilePic: updatedUser.profilePic };
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException("Fehler beim Hochladen des Profilbildes");
        }
    }

    @UseGuards(IsLoggedInGuard)
    @Get('profilepic/:profilepic')
    @ApiOperation({ summary: 'Lädt ein Profilbild herunter' })
    @ApiParam({
        name: 'profilepic',
        description: 'Der Name der Profilbilddatei',
        example: 'profile-pic.png',
    })
    @ApiResponse({ status: 200, description: 'Das Profilbild wurde erfolgreich geladen.' })
    @ApiResponse({ status: 400, description: 'Ungültige Anforderung oder Datei nicht gefunden.' })
    async getImage(@Param('profilepic') profilepic: string, @Res() res: Response) {
        try {
            const imgPath: string = join(process.cwd(), 'uploads', 'profilePictures', profilepic);
            res.sendFile(imgPath);
        } catch (err) {
            throw new BadRequestException(err);
        }
    }
}
