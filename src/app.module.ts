import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';

import {TypeOrmModule} from '@nestjs/typeorm';
import { LinkController } from './link/link.controller';
import { UserController } from './user/user.controller';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            timezone: '+02:00',
            entities: [],
            synchronize: true
        })
    ],
    controllers: [AppController, LinkController, UserController],
    providers: [AppService],
})
export class AppModule {
}
