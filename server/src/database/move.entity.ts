import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { IsEnum, IsInt } from 'class-validator';
import { Game } from './Game';
import { PlayerEnum } from './enums/PlayerEnum';

@Entity()
export class Move {
    @PrimaryGeneratedColumn()
    moveId: number;

    @ManyToOne(() => Game, game => game.moves)
    game: Game;

    @IsEnum(PlayerEnum)
    @Column({ enum: PlayerEnum })
    player: PlayerEnum;

    @IsInt()
    @Column()
    x: number;

    @IsInt()
    @Column()
    y: number;

    @CreateDateColumn()
    createdAt: string;
}
