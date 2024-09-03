import {BadRequestException, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User} from "../../../database/User";
import {AuthService} from "../../../common/services/auth/auth.service";
import {EditPasswordDTO} from "../dtos/editUser/EditPasswordDTO";
import * as bcrypt from 'bcryptjs';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private authService: AuthService, // Inject AuthService instance here
    ) {}


    async editPassword(editPasswordDTO: EditPasswordDTO, userID: number): Promise<User> {
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


    async updateProfilePic(userId: number, filename: string): Promise<User> {
        const user: User | null = await this.authService.getUserByUserId(userId);

        if (!user) {
            throw new BadRequestException("Benutzer nicht gefunden");
        }

        // Aktualisieren des Profilbild-Dateinamens
        user.profilePic = filename;
        await this.userRepository.save(user);

        return user;
    }


}
