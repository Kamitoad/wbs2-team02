import {Controller, Get, InternalServerErrorException, UseGuards,} from '@nestjs/common';
import {ApiInternalServerErrorResponse, ApiOkResponse, ApiTags} from "@nestjs/swagger";
import {ErrorDto} from "../../../../common/dtos/auth/ErrorDto";
import {ReadUserForAdminDto} from "../../dtos/ReadUserForAdminDto";
import {UserdataService} from "../../services/userdata/userdata.service";
import {RolesGuard} from "../../../../common/guards/roles/roles.guard";
import {Roles} from "../../../../common/decorators/roles/roles.decorator";
import {RoleEnum} from "../../../../database/enums/RoleEnum";

@ApiTags('Admin - Userdata')
@UseGuards(RolesGuard)
@Roles(RoleEnum.Admin)
@Controller('userdata')
export class UserdataController {
    constructor(
        public readonly userdataService: UserdataService
    ) {
    }

    @ApiOkResponse({
        type: ReadUserForAdminDto,
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
