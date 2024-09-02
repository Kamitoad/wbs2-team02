import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany} from 'typeorm';
import { User } from './User';
import { IsBoolean, IsEnum, IsInt } from 'class-validator';
import { Move } from './move.entity';
import { FieldStateEnum } from './enums/FieldStateEnum';
import { PlayerEnum } from './enums/PlayerEnum';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  gameId: number;

  @IsBoolean()
  @Column({ default: false })
  hasEnded: boolean;

  @IsEnum(FieldStateEnum)
  @Column({ type: 'enum', enum: FieldStateEnum, default: FieldStateEnum.NotFilled })
  field1_1: FieldStateEnum;

  @IsEnum(FieldStateEnum)
  @Column({ type: 'enum', enum: FieldStateEnum, default: FieldStateEnum.NotFilled })
  field1_2: FieldStateEnum;

  @IsEnum(FieldStateEnum)
  @Column({ type: 'enum', enum: FieldStateEnum, default: FieldStateEnum.NotFilled })
  field1_3: FieldStateEnum;

  @IsEnum(FieldStateEnum)
  @Column({ type: 'enum', enum: FieldStateEnum, default: FieldStateEnum.NotFilled })
  field2_1: FieldStateEnum;

  @IsEnum(FieldStateEnum)
  @Column({ type: 'enum', enum: FieldStateEnum, default: FieldStateEnum.NotFilled })
  field2_2: FieldStateEnum;

  @IsEnum(FieldStateEnum)
  @Column({ type: 'enum', enum: FieldStateEnum, default: FieldStateEnum.NotFilled })
  field2_3: FieldStateEnum;

  @IsEnum(FieldStateEnum)
  @Column({ type: 'enum', enum: FieldStateEnum, default: FieldStateEnum.NotFilled })
  field3_1: FieldStateEnum;

  @IsEnum(FieldStateEnum)
  @Column({ type: 'enum', enum: FieldStateEnum, default: FieldStateEnum.NotFilled })
  field3_2: FieldStateEnum;

  @IsEnum(FieldStateEnum)
  @Column({ type: 'enum', enum: FieldStateEnum, default: FieldStateEnum.NotFilled })
  field3_3: FieldStateEnum;

  @ManyToOne(() => User, user => user.gamesAsPlayer1)
  player1: User;

  @ManyToOne(() => User, user => user.gamesAsPlayer2)
  player2: User;

  @IsInt()
  @Column({ nullable: true, default: null })
  winner: number;

  @IsInt()
  @Column({ nullable: true, default: null })
  loser: number;

  @IsInt()
  @Column({ nullable: true, default: null })
  changeEloPlayer1: number;

  @IsInt()
  @Column({ nullable: true, default: null })
  changeEloPlayer2: number;

  @CreateDateColumn()
  createdAt: Date;

  @IsEnum(PlayerEnum)
  @Column({ type: 'enum', enum: PlayerEnum })
  currentTurn: PlayerEnum;

  @OneToMany(() => Move, move => move.game)
  moves: Move[];
}
