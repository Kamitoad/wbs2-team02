import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';
import { IsEnum, IsInt } from 'class-validator';
import { FieldStateEnum } from './enums/FieldStateEnum';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  gameId: number;

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
  @Column()
  winner: number;

  @IsInt()
  @Column()
  loser: number;

  @IsInt()
  @Column()
  changeEloPlayer1: number;

  @IsInt()
  @Column()
  changeEloPlayer2: number;
}
