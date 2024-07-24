import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './database/User';
import { Game } from './database/Game';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'node:path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './db.sqlite',
      entities: [
        User,
        Game
      ],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([
      User,
      Game,
    ]),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(process.cwd(), '..', 'client', 'dist', 'client', 'browser'),
    }),
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
  ],
})
export class AppModule {
}
