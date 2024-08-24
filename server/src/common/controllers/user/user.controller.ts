import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from '../../services/user.service/user.service';
import { CreateUserDTO} from "../../dtos/createUserDTO";

@Controller('api/user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('/checkUsername')
    async checkUsername(@Body('username') username: string) {
        return this.userService.isUsernameTaken(username);
    }

    @Post()
    async createUser(@Body() createUserDto: CreateUserDTO) {
        return this.userService.createUser(createUserDto);
    }
}
