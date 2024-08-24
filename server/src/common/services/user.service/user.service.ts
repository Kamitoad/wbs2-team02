import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User} from "../../../database/User";
import { CreateUserDTO} from "../../dtos/createUserDTO";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    async isUsernameTaken(userName: string): Promise<boolean> {
        const user = await this.userRepository.findOne({ where: { userName } });
        return !!user;
    }

    async createUser(createUserDto: CreateUserDTO): Promise<User> {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = this.userRepository.create({
            ...createUserDto,
            password: hashedPassword
        });
        return this.userRepository.save(user);
    }
}
