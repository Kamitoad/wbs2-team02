import {
    BadRequestException,
    Body,
    ConflictException,
    Controller,
    InternalServerErrorException,
    Patch,
    Session, UseGuards
} from '@nestjs/common';
import {SessionData} from "express-session";
import {ReadUserDto} from "../../../common/dtos/auth/ReadUserDto";
import {UserService} from "../services/user.service";
import {EditPasswordDTO} from "../dtos/editUser/EditPasswordDTO";
import {IsLoggedInGuard} from "../../../common/guards/is-logged-in/is-logged-in.guard";


@Controller('user')
export class UserController {
    constructor(
        public readonly userService: UserService,
    ) {

    }

    @UseGuards(IsLoggedInGuard)
    @Patch('password')
    async editPassword(
        @Session() session: SessionData,
        @Body() body: EditPasswordDTO,
    ): Promise<ReadUserDto> {
        try {
            const user: number = session.currentUser;
            const editPasword = await this.userService.editPassword(body, user);
            // session.currentUser = editUser.userId;

            return new ReadUserDto(editPasword);

        } catch (error) {
            if (error instanceof BadRequestException) {
                throw new BadRequestException(error.message);
            } else if (error instanceof ConflictException) {
                throw new ConflictException(error.message);
            } else {
                throw new InternalServerErrorException("Fehler bei der Änderung");
            }
        }
    }
}
