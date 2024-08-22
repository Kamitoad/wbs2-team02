import {ConflictException, Injectable} from '@nestjs/common';
import {CreateUserDto} from "../../dtos/user/CreateUserDto";
import {User} from "../../../database/User";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {RoleEnum} from "../../../database/enums/RoleEnum";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}
    async register(createUserDto: CreateUserDto): Promise<User> {
        const checkUserEmail = await this.userRepository.findOne({
            where: { email: createUserDto.email }
        });
        if (checkUserEmail) {
            throw new ConflictException(
                "User existiert bereits"
            )
        }

        const checkUserName = await this.userRepository.findOne({
            where: { userName: createUserDto.userName }
        });
        if (checkUserName) {
            throw new ConflictException(
                "User existiert bereits"
            )
        }

        const newUser: User = this.userRepository.create();
        newUser.userName = createUserDto.userName;
        newUser.email = createUserDto.email;
        newUser.password = createUserDto.password;
        newUser.firstName = createUserDto.firstName;
        newUser.lastName = createUserDto.lastName;
        newUser.role = RoleEnum.User;
        newUser.elo = 1000
        newUser.profilePic = null;
        newUser.inQueue = false;
    }
}
