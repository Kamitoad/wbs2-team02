import {
    Controller, Get,
    InternalServerErrorException,
} from '@nestjs/common';
import {
    ApiInternalServerErrorResponse, ApiOkResponse,
    ApiTags
} from "@nestjs/swagger";
import {OkDto} from "../../../../common/dtos/OkDto";
import {ErrorDto} from "../../../../common/dtos/auth/ErrorDto";
import {ReadUserForAdminDto} from "../../dtos/ReadUserForAdminDto";
import {UserdataService} from "../../services/userdata/userdata.service";

@ApiTags('userdata')
@Controller('userdata')
export class UserdataController {
    constructor(
        public readonly userdataService: UserdataService
    ) {
    }

    @ApiOkResponse({
        type: OkDto,
        description: 'User wurden geladen'
    })
    @ApiInternalServerErrorResponse({
        type: ErrorDto,
        description: 'Fehler beim Laden der User'
    })
    @Get('allUsers')
    async getAllUsers(): Promise<ReadUserForAdminDto[]> {
        try {
            const users = await this.userdataService.getAllUsers();
            return users.map(user => new ReadUserForAdminDto(user));
        } catch (error) {
            throw new InternalServerErrorException("Fehler beim Laden der User");
        }
    }
}
