import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../../../../database/User";
import {Repository} from "typeorm";

@Injectable()
export class UserdataService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {
    }
    async getAllUsers(): Promise<User[]> {
        return await this.userRepository.find();
    }
}
