import { Body, Controller, Post, Session,
    UnauthorizedException } from '@nestjs/common';
import { SessionData } from "express-session";

@Controller('auth')
export class AuthController {
    @Post('login')
    login(
        @Session() session: SessionData,
        @Body('username') username: string,
    ): void {
        if (username == 'admin') {
            session.isLoggedIn = true;
        } else {
            throw new UnauthorizedException();
        }
    }
    @Post('logout')
    logout(@Session() session: SessionData): void {
        session.isLoggedIn = undefined;
    }
}