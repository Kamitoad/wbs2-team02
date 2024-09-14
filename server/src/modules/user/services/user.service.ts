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
            throw new BadRequestException("Benutzer nicht gefunden");
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
            throw new NotFoundException(`User with ID ${userId} not found.`);
        }
        return user;
    }


    async getUserMatches(userId: number): Promise<any[]> {
        const user = await this.userRepository.findOne({ where: { userId } });
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found.`);
        }


        //Select the games where userId = player1
        const gamesAsPlayer1 = await this.gameRepository.find({
            where: { player1: { userId }, hasEnded: 1 },
            relations: ['player2'],
            select: ['gameId', 'hasEnded', 'winner', 'loser', 'changeEloPlayer1', 'changeEloPlayer2'],
        });

        //Select the games where userId = player2
        const gamesAsPlayer2 = await this.gameRepository.find({
            where: { player2: { userId }, hasEnded: 1 },
            relations: ['player1'],
            select: ['gameId', 'hasEnded', 'winner', 'loser', 'changeEloPlayer1', 'changeEloPlayer2'],
        });

        // combine resulting arrays
        const formatGames = [
            ...gamesAsPlayer1.map(game => ({
                gameId: game.gameId,
                hasEnded: game.hasEnded,
                winner: game.winner,
                loser: game.loser,
                changeEloPlayer1: game.changeEloPlayer1,
                changeEloPlayer2: game.changeEloPlayer2,
                player1: {
                    userId: userId,
                    userName: user.userName
                },
                player2: {
                    userId: game.player2.userId,
                    userName: game.player2.userName
                }
            })),
            ...gamesAsPlayer2.map(game => ({
                gameId: game.gameId,
                hasEnded: game.hasEnded,
                winner: game.winner,
                loser: game.loser,
                changeEloPlayer1: game.changeEloPlayer1,
                changeEloPlayer2: game.changeEloPlayer2,
                player1: {
                    userId: game.player1.userId,
                    userName: game.player1.userName
                },
                player2: {
                    userId: userId,
                    userName: user.userName
                }
            }))
        ];

        return formatGames;
    }
}
