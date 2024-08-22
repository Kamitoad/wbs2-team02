import { Body, Controller, Post, Session,
    UnauthorizedException } from '@nestjs/common';
import { SessionData } from "express-session";
import {CreateUserDto} from "../../dtos/user/CreateUserDto";
import {ApiResponse} from "@nestjs/swagger";
import {OkDto} from "../../dtos/OkDto";
import {AuthService} from "../../services/auth/auth.service";

@Controller('auth')
export class AuthController {
    constructor(
        public readonly authService: AuthService
    ) {
    }

    @ApiResponse( { type: OkDto, description: 'Successfully logged in' })
    @Post('register')
    async register(
        @Session() session: SessionData,
        @Body() body: CreateUserDto,
    ) {
        const user = this.authService.register(body);

        session.currentUser = user.userId;

        return OkDto(true, "User erfolgreich registriert")
    }

    @Post('login')
    login(
        @Session() session: SessionData,
        @Body('username') username: string,
    ): void {
        /*if (username == 'admin') {
            session.isLoggedIn = true;
        } else {
            throw new UnauthorizedException();
        }*/
        session.currentUser = 1;
    }
    @Post('logout')
    logout(@Session() session: SessionData): void {
        session.isLoggedIn = undefined;
    }
}