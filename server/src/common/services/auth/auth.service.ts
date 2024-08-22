import {BadRequestException, ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {CreateUserDto} from "../../dtos/user/CreateUserDto";
import {User} from "../../../database/User";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {RoleEnum} from "../../../database/enums/RoleEnum";
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {
    }

    async register(createUserDto: CreateUserDto): Promise<User> {
        await this.validateRegister(createUserDto);

        const newUser: User = this.userRepository.create();
        newUser.userName = createUserDto.userName;
        newUser.email = createUserDto.email;
        newUser.password = await bcrypt.hash(createUserDto.password, 10);
        newUser.firstName = createUserDto.firstName;
        newUser.lastName = createUserDto.lastName;
        newUser.role = RoleEnum.User;
        newUser.elo = 1000
        newUser.profilePic = null;
        newUser.inQueue = false;
        newUser.totalWins = 0;
        newUser.totalLosses = 0;

        await this.userRepository.save(newUser);

        return await this.getUserByEmail(newUser.email);
    }

    async getUserByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOne({where: {email}});
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    private async validateRegister(createUserDto: CreateUserDto) {
        //checks if email is already in user table of database
        const checkUserEmail = await this.userRepository.findOne({
            where: {email: createUserDto.email}
        });
        if (checkUserEmail) {
            throw new ConflictException(
                "User existiert bereits mit dieser Email"
            )
        }

        //checks if userName is already in user table of database
        const checkUserUserName = await this.userRepository.findOne({
            where: {userName: createUserDto.userName}
        });
        if (checkUserUserName) {
            throw new ConflictException(
                "User existiert bereits mit diesem Usernamen"
            )
        }

        if (!createUserDto.agb) {
            throw new BadRequestException("Du musst den AGBs und der Datenschutzerklärung zustimmen")
        }

        if (createUserDto.password !== createUserDto.passwordConfirm) {
            throw new BadRequestException("Du musst deine Email-Adresse zweimal richtig eingeben")
        }

        if (createUserDto.password !== createUserDto.passwordConfirm) {
            throw new BadRequestException("Du musst dein Passwort zweimal richtig eingeben")
        }
    }
}
