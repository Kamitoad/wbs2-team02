import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './database/User';
import { Game } from './database/Game';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'node:path';
import {AuthController} from "./common/controllers/auth/auth.controller";
import {AuthService} from "./common/services/auth/auth.service";
import {UserdataController} from "./modules/admin/controllers/userdata/userdata.controller";
import {UserdataService} from "./modules/admin/services/userdata/userdata.service";

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
    AuthController,
    UserdataController,
  ],
  providers: [
    AppService,
    AuthService,
    UserdataService,
  ],
})
export class AppModule {
}
