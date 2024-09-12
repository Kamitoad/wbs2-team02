import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from "../../../database/User";
import { AuthService } from "../../../common/services/auth/auth.service";
import { EditPasswordDto } from "../dtos/editUser/EditPasswordDto";
import * as bcrypt from 'bcryptjs';
import { promises as fsPromises } from 'fs';
import { join } from 'path';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private authService: AuthService,
    ) {}

    async editPassword(editPasswordDTO: EditPasswordDto, userID: number): Promise<User> {
        const user: User | null = await this.authService.getUserByUserId(userID);
        const isPasswordValid = await bcrypt.compare(editPasswordDTO.oldPassword, user.password);
        if (!isPasswordValid) {
            throw new BadRequestException("Altes Password nicht korrekt");
        }
        user.password = await bcrypt.hash(editPasswordDTO.newPassword, 10);
        await this.userRepository.save(user);
        return user;
    }

    async deleteProfilePic(userID: number): Promise<User> {
        const user: User | null = await this.authService.getUserByUserId(userID);
        user.profilePic = null;
        await this.userRepository.save(user);
        return user;
    }

    async updateProfilePic(userId: number, file: Express.Multer.File): Promise<User> {
        const user: User | null = await this.authService.getUserByUserId(userId);
        if (!user) {
            throw new BadRequestException("Benutzer nicht gefunden");
        }
        if (!file) {
            throw new BadRequestException('Keine Datei hochgeladen');
        }

        const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validMimeTypes.includes(file.mimetype)) {
            throw new BadRequestException('Nur Bilddateien sind erlaubt!');
        }

        const fileName = file.originalname;
        const filePath = join(process.cwd(), 'uploads', 'profilePictures', fileName);

        // Prüfen, ob die Datei bereits existiert
        try {
            await fsPromises.access(filePath);
        } catch (error) {
            // Datei existiert nicht, keine weiteren Schritte nötig
        }

        // Aktualisieren des Profilbildes des Benutzers
        user.profilePic = fileName;
        await this.userRepository.save(user);

        return user;
    }
}
