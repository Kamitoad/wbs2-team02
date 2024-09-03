import {
    BadRequestException,
    Body,
    ConflictException,
    Controller,
    InternalServerErrorException,
    Param,
    Patch,
    Res,
    Session,
    UseGuards,
    UploadedFile,
    UseInterceptors, Get, Delete
} from '@nestjs/common';
import {SessionData} from "express-session";
import {ReadUserDto} from "../../../common/dtos/auth/ReadUserDto";
import {UserService} from "../services/user.service";
import {EditPasswordDTO} from "../dtos/editUser/EditPasswordDTO";
import {IsLoggedInGuard} from "../../../common/guards/is-logged-in/is-logged-in.guard";
import {AuthService} from "../../../common/services/auth/auth.service";
import {join} from "path";
import { Response } from 'express';
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from 'multer';
import { extname } from 'path';
import { promises as fsPromises } from 'fs';


@Controller('user')
export class UserController {
    constructor(
        public readonly userService: UserService,
        private authService: AuthService
    ) {

    }

    @UseGuards(IsLoggedInGuard)
    @Patch('password')
    async editPassword(
        @Session() session: SessionData,
        @Body() body: EditPasswordDTO,
    ): Promise<ReadUserDto> {
        try {
            const user: number = session.currentUser;
            const editPasword = await this.userService.editPassword(body, user);
            // session.currentUser = editUser.userId;

            return new ReadUserDto(editPasword);

        } catch (error) {
            if (error instanceof BadRequestException) {
                throw new BadRequestException(error.message);
            } else if (error instanceof ConflictException) {
                throw new ConflictException(error.message);
            } else {
                throw new InternalServerErrorException("Fehler bei der Änderung");
            }
        }
    }

    @UseGuards(IsLoggedInGuard)
    @Delete('profilepic')
    async deleteProfilePic(
        @Session() session: SessionData,
    ): Promise<ReadUserDto> {
        try {
            const user: number = session.currentUser;
            const editPasword = await this.userService.deleteProfilePic(user);
            // session.currentUser = editUser.userId;

            return new ReadUserDto(editPasword);

        } catch (error) {
            if (error instanceof BadRequestException) {
                throw new BadRequestException(error.message);
            } else if (error instanceof ConflictException) {
                throw new ConflictException(error.message);
            } else {
                throw new InternalServerErrorException("Fehler bei der Änderung");
            }
        }
    }

    @UseGuards(IsLoggedInGuard)
    @Get('profilepic/:profilepic')
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

    @UseGuards(IsLoggedInGuard)
    @Get('profilepic')
    async getProfilPic(
        @Session() session: SessionData,
    ): Promise<ReadUserDto> {
        try {
            const user: number = session.currentUser;
            const userData = await this.authService.getUserByUserId(user);
            // session.currentUser = editUser.userId;

            return new ReadUserDto(userData);

        } catch (error) {
            if (error instanceof BadRequestException) {
                throw new BadRequestException(error.message);
            } else if (error instanceof ConflictException) {
                throw new ConflictException(error.message);
            } else {
                throw new InternalServerErrorException("Fehler bei der Änderung");
            }
        }
    }

    @UseGuards(IsLoggedInGuard)
    @Patch('profilepic')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/profilePictures',
            filename: (req, file, cb) => {
                const ext = extname(file.originalname);
                cb(null, file.originalname); // Behalte den ursprünglichen Dateinamen bei
            },
        }),
        limits: { fileSize: 1024 * 1024 * 5 }, // Limit der Datei auf 5 MB
        fileFilter: (req, file, cb) => {
            const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (validMimeTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new BadRequestException('Nur Bilddateien sind erlaubt!'), false);
            }
        },
    }))
    async uploadProfilePic(
        @Session() session: SessionData,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<{ newProfilePic: string }> {
        try {
            if (!file) {
                throw new BadRequestException('Keine Datei hochgeladen');
            }

            const userId: number = session.currentUser;
            const fileName = file.originalname;
            const filePath = join(process.cwd(), 'uploads', 'profilePictures', fileName);

            // Überprüfe, ob die Datei bereits existiert
            try {
                await fsPromises.access(filePath);
                // Datei existiert bereits, logge dies oder handle es wie benötigt
            } catch (error) {
                // Datei existiert nicht, es wird keine zusätzliche Logik benötigt
            }

            // Update des Benutzerprofils mit dem neuen oder vorhandenen Dateinamen
            const updatedUser = await this.userService.updateProfilePic(userId, fileName);

            if (!updatedUser) {
                throw new ConflictException("Fehler beim Aktualisieren des Profilbildes");
            }

            return { newProfilePic: fileName };

        } catch (error) {
            if (error instanceof BadRequestException) {
                throw new BadRequestException(error.message);
            } else {
                throw new InternalServerErrorException("Fehler beim Hochladen des Profilbildes");
            }
        }
    }

}
