import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../database/User';
import { Game } from '../../../database/Game';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,

        @InjectRepository(Game)
        private gameRepository: Repository<Game>
    ) {}

    // Fetch the current user by ID
    async getCurrentUser(userId: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { userId } });
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found.`);
        }
        return user;
    }

    // Fetch matches for a specific user
    async getUserMatches(userId: number): Promise<Game[]> {
        const user = await this.userRepository.findOne({ where: { userId } });
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found.`);
        }
        const gamesAsPlayer1 = await this.gameRepository.find({ where: { player1: { userId }, hasEnded: 1 }, relations: ['player2'] });
        const gamesAsPlayer2 = await this.gameRepository.find({ where: { player2: { userId }, hasEnded: 1 }, relations: ['player1'] });

        return [...gamesAsPlayer1, ...gamesAsPlayer2];
    }
}
