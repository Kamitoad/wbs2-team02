import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IsEmail } from 'class-validator';
import { Game } from './Game';
import { RoleEnum } from './enums/RoleEnum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ unique: true })
  userName: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @Column()
  role: RoleEnum

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  elo: number;

  @Column()
  profilePic: string;

  @Column()
  inQueue: boolean;

  @OneToMany(() => Game, (game) => game.player1)
  gamesAsPlayer1: Promise<Game[]>;

  @OneToMany(() => Game, (game) => game.player2)
  gamesAsPlayer2: Promise<Game[]>;

  @Column()
  totalWins: number;

  @Column()
  totalLosses: number;
}
