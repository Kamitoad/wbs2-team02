// make-move.dto.ts
import { IsEnum, IsInt } from 'class-validator';
import { PlayerEnum } from '../../../../database/enums/PlayerEnum';

export class MakeMoveDto {
    @IsInt()
    x: number;

    @IsInt()
    y: number;

    @IsEnum(PlayerEnum)
    player: PlayerEnum;
}
