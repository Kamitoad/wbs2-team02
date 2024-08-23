import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(User)
        private readonly repository: Repository<User>,
    ) {}

    // Methode zum Finden eines Benutzers anhand der ID
    async findOne(userId: number): Promise<User | undefined> {
        return this.repository.findOne({ where: { userId } });
    }

    // Methode zum Erstellen eines neuen Benutzers
    async createUser(user: Partial<User>): Promise<User> {
        const newUser = this.repository.create(user);
        return this.repository.save(newUser);
    }

    // Methode zum Updaten eines Benutzers
    async updateUser(userId: number, updatedData: Partial<User>): Promise<void> {
        await this.repository.update(userId, updatedData);
    }

    // Weitere Methoden für User-Operationen hinzufügen, je nach Bedarf
}
