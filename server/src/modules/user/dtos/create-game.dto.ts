import { IsInt, IsOptional } from 'class-validator';

export class CreateGameDto {
    @IsInt()
    player1Id: number;

    @IsInt()
    player2Id: number;

    @IsOptional()
    field1_1?: number;

    @IsOptional()
    field1_2?: number;

    @IsOptional()
    field1_3?: number;

    @IsOptional()
    field2_1?: number;

    @IsOptional()
    field2_2?: number;

    @IsOptional()
    field2_3?: number;

    @IsOptional()
    field3_1?: number;

    @IsOptional()
    field3_2?: number;

    @IsOptional()
    field3_3?: number;
}