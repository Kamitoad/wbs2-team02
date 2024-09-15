import {Controller, Get, InternalServerErrorException, UseGuards,} from '@nestjs/common';
import {ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
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

    @ApiOperation({ summary: 'Lädt die Daten aller Benutzer für die Admins' })
    @ApiOkResponse({
        type: ReadUserForAdminDto,
        description: 'User wurden geladen',
        example: [
            {
                "userId": 1,
                "userName": "MaxUserman",
                "email": "max@mustermann.de",
                "role": "user",
                "firstName": "Max",
                "lastName": "Mustermann",
                "elo": 1000,
                "profilePic": "maxPb.png",
                "totalWins": 10,
                "totalTies": 5,
                "totalLosses": 20
            },
            {
                "userId": 2,
                "userName": "Kamitoad",
                "email": "kami@toad.de",
                "role": "admin",
                "firstName": "Kami",
                "lastName": "van Toad",
                "elo": 1000,
                "profilePic": "kamiPb.png",
                "totalWins": 20,
                "totalTies": 5,
                "totalLosses": 10
            }
        ],
    })
    @ApiInternalServerErrorResponse({
        type: ErrorDto,
        description: 'Fehler beim Laden der User',
        example: {
            "statusCode": 500,
            "error": "Internal Server Error",
            "message": "Fehler beim Laden der User"
        }
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
