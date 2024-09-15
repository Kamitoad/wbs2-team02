import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from "../../../database/User";
import { AuthService } from "../../../common/services/auth/auth.service";
import { EditPasswordDto } from "../dtos/editUser/EditPasswordDto";
import * as bcrypt from 'bcryptjs';
import { promises as fsPromises } from 'fs';
import { join } from 'path';
import {Game} from "../../../database/Game";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,

        @InjectRepository(Game)
        private gameRepository: Repository<Game>,

        private authService: AuthService,
    ) {}

    // checks first, if the old password is the same with the one in the database
    // then patches the new password
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

    // sets the profilePic to null
    async deleteProfilePic(userID: number): Promise<User> {
        const user: User | null = await this.authService.getUserByUserId(userID);
        user.profilePic = null;
        await this.userRepository.save(user);
        return user;
    }

    // updates the new ProfilePic of the User and saves the Picture in the Server
    async updateProfilePic(userId: number, file: Express.Multer.File): Promise<User> {
        const user: User | null = await this.authService.getUserByUserId(userId);
        if (!user) {
            throw new NotFoundException("Benutzer nicht gefunden");
        }
        if (!file) {
            throw new BadRequestException('Keine Datei hochgeladen');
        }

        // checkes for valid Picture datatypes
        const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validMimeTypes.includes(file.mimetype)) {
            throw new BadRequestException('Nur Bilddateien sind erlaubt!');
        }

        const fileName = file.originalname;
        const filePath = join(process.cwd(), 'uploads', 'profilePictures', fileName);

        // Checks if the picture is already saved and then saves the picture
        try {
            await fsPromises.access(filePath);
        } catch (error) {
        }

        // Refreshes the Profilepic in the databank
        user.profilePic = fileName;
        await this.userRepository.save(user);

        return user;
    }

    // Fetch the current user by ID
    async getCurrentUser(userId: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { userId },
            select:['userName','userId','elo','email','firstName','lastName','role','profilePic','totalWins','totalTies','totalLosses']
            });
        if (!user) {
            throw new NotFoundException(`Benutzer mit der ID ${userId} nicht gefunden`);
        }
        return user;
    }


    async getUserMatches(userId: number): Promise<any[]> {
        const user = await this.userRepository.findOne({ where: { userId } });
        if (!user) {
            throw new NotFoundException(`Benutzer mit der ID ${userId} nicht gefunden`);
        }

        return await this.gameRepository.find({
            where: [
                { player1: { userId }, hasEnded: true },
                { player2: { userId }, hasEnded: true }
            ],
            relations: ['player1', 'player2'],
        })
    }
}
