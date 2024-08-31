import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from '../../database/Game';
import { User } from '../../database/User';
import { GameService } from './game.service';
import { GameController } from './game.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Game, User])],
  providers: [GameService],
  controllers: [GameController],
})
export class GameModule {}
