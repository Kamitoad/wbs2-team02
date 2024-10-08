import {Module, OnModuleInit} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from './database/User';
import {Game} from './database/Game';
import {ServeStaticModule} from '@nestjs/serve-static';
import * as path from 'node:path';
import {AuthController} from "./common/controllers/auth/auth.controller";
import {AuthService} from "./common/services/auth/auth.service";
import {UserdataController} from "./modules/admin/controllers/userdata/userdata.controller";
import {UserdataService} from "./modules/admin/services/userdata/userdata.service";
import {UserdataGateway} from "./modules/admin/gateways/userdata/userdata.gateway";
import {GamedataController} from "./modules/admin/controllers/gamedata/gamedata.controller";
import {GamedataService} from "./modules/admin/services/gamedata/gamedata.service";
import {GamedataGateway} from "./modules/admin/gateways/gamedata/gamedata.gateway";
import {QueueController} from "./modules/user/controllers/queue/queue.controller";
import {QueueService} from "./modules/user/services/queue/queue.service";
import {QueueGateway} from "./modules/user/gateways/queue/queue.gateway";
import {UserController} from "./modules/user/controllers/user.controller";
import {UserService} from "./modules/user/services/user.service";
import {GameController} from './modules/user/controllers/game/game.controller';
import {GameService} from './modules/user/services/game/game.service';
import {GameGateway} from './modules/user/gateways/game/game.gateway';
import {SeedService} from "./database/seed-service/seed.service";


@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: './db.sqlite',
            entities: [User, Game],
            synchronize: true,
        }),
        TypeOrmModule.forFeature([User, Game]),
        ServeStaticModule.forRoot({
            rootPath: path.resolve(process.cwd(), '..', 'client', 'dist', 'client', 'browser'),
        }),
    ],
    controllers: [
        AppController,
        AuthController,
        UserdataController,
        GamedataController,
    UserController,
        QueueController,
    GameController,
    ],
    providers: [
        AppService,
        AuthService,
        UserdataService,
        UserdataGateway,
        GamedataService,
        GamedataGateway,
    UserService,
        QueueService,
        QueueGateway,
    GameService,
    GameGateway,
        SeedService,
    ],
})
export class AppModule implements OnModuleInit {
    constructor(private readonly seedService: SeedService) {}

    async onModuleInit() {
        await this.seedService.seed();
    }
}
