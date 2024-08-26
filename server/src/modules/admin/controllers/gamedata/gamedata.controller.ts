import {
    Controller, Get,
    InternalServerErrorException,
} from '@nestjs/common';
import {
    ApiInternalServerErrorResponse, ApiOkResponse, ApiTags
} from "@nestjs/swagger";
import {ErrorDto} from "../../../../common/dtos/auth/ErrorDto";
import {GamedataService} from "../../services/gamedata/gamedata.service";
import {ReadCurrentGamesDto} from "../../dtos/ReadCurrentGamesDto";

@ApiTags('Admin - Gamedata')
@Controller('admin/gamedata')
export class GamedataController {
    constructor(
        public readonly gamedataService: GamedataService
    ) {
    }

    @ApiOkResponse({
        type: ReadCurrentGamesDto,
        description: 'Laufende Spiele wurden geladen'
    })
    @ApiInternalServerErrorResponse({
        type: ErrorDto,
        description: 'Fehler beim Laden der laufenden Spiele'
    })
    @Get('allCurrentGames')
    async getAllCurrentGames(): Promise<ReadCurrentGamesDto[]> {
        try {
            const games = await this.gamedataService.getAllCurrentGames();
            return games.map(game => new ReadCurrentGamesDto(game));
        } catch (error) {
            throw new InternalServerErrorException("Fehler beim Laden der User");
        }
    }
}
