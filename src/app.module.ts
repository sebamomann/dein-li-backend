import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';

import {TypeOrmModule} from '@nestjs/typeorm';
import {UserModule} from "./user/user.module";
import {LinkModule} from "./link/link.module";
import {AuthModule} from "./auth/auth.module";
import {Link} from "./link/link.entity";
import {User} from "./user/user.entity";
import {Session} from "./user/session.entity";
import {Call} from "./link/call/call.entity";
import {CallModule} from "./link/call/call.module";

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
            entities: [User, Session, Link, Call],
            synchronize: true
        }),
        UserModule,
        LinkModule,
        AuthModule,
        CallModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
