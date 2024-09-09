import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';
import { IsBoolean, IsEnum, IsInt } from 'class-validator';
import { FieldStateEnum } from './enums/FieldStateEnum';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  gameId: number;

  @IsBoolean()
  @Column({ default: false })
  hasEnded: boolean;

  @IsEnum(FieldStateEnum)
  @Column({ enum: FieldStateEnum, default: FieldStateEnum.NotFilled })
  field1_1: FieldStateEnum;

  @IsEnum(FieldStateEnum)
  @Column({ enum: FieldStateEnum, default: FieldStateEnum.NotFilled })
  field1_2: FieldStateEnum;

  @IsEnum(FieldStateEnum)
  @Column({ enum: FieldStateEnum, default: FieldStateEnum.NotFilled })
  field1_3: FieldStateEnum;

  @IsEnum(FieldStateEnum)
  @Column({ enum: FieldStateEnum, default: FieldStateEnum.NotFilled })
  field2_1: FieldStateEnum;

  @IsEnum(FieldStateEnum)
  @Column({ enum: FieldStateEnum, default: FieldStateEnum.NotFilled })
  field2_2: FieldStateEnum;

  @IsEnum(FieldStateEnum)
  @Column({ enum: FieldStateEnum, default: FieldStateEnum.NotFilled })
  field2_3: FieldStateEnum;

  @IsEnum(FieldStateEnum)
  @Column({ enum: FieldStateEnum, default: FieldStateEnum.NotFilled })
  field3_1: FieldStateEnum;

  @IsEnum(FieldStateEnum)
  @Column({ enum: FieldStateEnum, default: FieldStateEnum.NotFilled })
  field3_2: FieldStateEnum;

  @IsEnum(FieldStateEnum)
  @Column({ enum: FieldStateEnum, default: FieldStateEnum.NotFilled })
  field3_3: FieldStateEnum;

  // ManyToOne relations for players
  @ManyToOne(() => User, (user) => user.gamesAsPlayer1)
  player1: User;

  @ManyToOne(() => User, (user) => user.gamesAsPlayer2)
  player2: User;

  @IsInt()
  @Column({ nullable: true, default: null })
  winner: number;

  @IsInt()
  @Column({ nullable: true, default: null })
  loser: number;

  @IsBoolean()
  @Column({ default: false })
  isTie: boolean;

  @IsInt()
  @Column({ nullable: true, default: null })
  changeEloPlayer1: number;

  @IsInt()
  @Column({ nullable: true, default: null })
  changeEloPlayer2: number;

  // Set currentPlayer1 and currentPlayer2 as relations to User
  @ManyToOne(() => User, { nullable: true })
  currentPlayer1: User;

  @ManyToOne(() => User, { nullable: true })
  currentPlayer2: User;
}
