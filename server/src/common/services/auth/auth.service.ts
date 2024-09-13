import {BadRequestException, ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {CreateUserDto} from "../../dtos/auth/CreateUserDto";
import {User} from "../../../database/User";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {RoleEnum} from "../../../database/enums/RoleEnum";
import * as bcrypt from 'bcryptjs';
import {LoginDto} from "../../dtos/auth/LoginDto";
import {UserdataGateway} from "../../../modules/admin/gateways/userdata/userdata.gateway";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private userdataGateway: UserdataGateway,
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
        newUser.totalTies = 0;
        newUser.totalLosses = 0;

        await this.userRepository.save(newUser);

        this.userdataGateway.notifyUserRegistered(newUser);

        return await this.getUserByEmail(newUser.email);
    }

    private async validateRegister(createUserDto: CreateUserDto) {
        const usernameRegex = /^[a-zA-Z0-9]{6,20}$/;

        createUserDto.userName = createUserDto.userName.trim();
        createUserDto.firstName = createUserDto.firstName.trim();
        createUserDto.lastName = createUserDto.lastName.trim();
        createUserDto.email = createUserDto.email.trim();
        createUserDto.confirmEmail = createUserDto.confirmEmail.trim();
        createUserDto.password = createUserDto.password.trim();
        createUserDto.confirmPassword = createUserDto.confirmPassword.trim();

        // Validierung für den Benutzernamen
        if (!usernameRegex.test(createUserDto.userName)) {
            if (createUserDto.userName.length < 6) {
                throw new BadRequestException("Dein Nutzername muss mindestens 6 Zeichen lang sein");
            } else if (createUserDto.userName.length > 20) {
                throw new BadRequestException("Dein Nutzername darf nicht länger als 20 Zeichen sein");
            } else {
                throw new BadRequestException("Dein Nutzername darf nur Buchstaben und Zahlen enthalten");
            }
        }

        //checks if email is already in auth table of database
        const checkUserByEmail = await this.userRepository.findOne({
            where: {email: createUserDto.email}
        });
        if (checkUserByEmail) {
            throw new ConflictException(
                "User existiert bereits mit dieser Email"
            )
        }

        //checks if userName is already in auth table of database
        const checkUserByUserName = await this.userRepository.findOne({
            where: {userName: createUserDto.userName}
        });
        if (checkUserByUserName) {
            throw new ConflictException(
                "User existiert bereits mit diesem Usernamen"
            )
        }

        if (!createUserDto.agb) {
            throw new BadRequestException("Du musst den AGBs und der Datenschutzerklärung zustimmen")
        }

        if (createUserDto.email !== createUserDto.confirmEmail) {
            throw new BadRequestException("Du musst deine Email-Adresse zweimal richtig eingeben")
        }

        if (createUserDto.password !== createUserDto.confirmPassword) {
            throw new BadRequestException("Du musst dein Passwort zweimal richtig eingeben")
        }
    }

    async getUserByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOne({where: {email}});
        if (!user) {
            throw new NotFoundException('User nicht gefunden');
        }
        return user;
    }

    async login(loginDto: LoginDto): Promise<User> {
        loginDto.userName = loginDto.userName.trim();
        loginDto.password = loginDto.password.trim();

        const user: User | null = await this.getUserByUserName(loginDto.userName);
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new BadRequestException("Email oder Passwort inkorrekt");
        }
        return user;
    }

    async logout(userId: number) {
        const user = await this.getUserByUserId(userId);
        if (!user) {
            throw new NotFoundException('User nicht gefunden');
        }

        if (!user.inQueue) {
            throw new BadRequestException("Nutzer nicht in der Queue");
        }

        user.queueStartTime = null;
        user.inQueue = false;
        await this.userRepository.save(user);
    }

    async getUserByUserName(userName: string) {
        const user = await this.userRepository.findOne({where: {userName}});
        if (!user) {
            throw new NotFoundException('User nicht gefunden');
        }
        return user;
    }

    async getUserByUserId(userId: number) {
        const user = await this.userRepository.findOne({where: {userId}});
        if (!user) {
            throw new NotFoundException('User nicht gefunden');
        }
        return user;
    }
}
