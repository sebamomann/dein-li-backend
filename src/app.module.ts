import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';

import {TypeOrmModule} from '@nestjs/typeorm';
import {UserModule} from "./user/user.module";
import {LinkModule} from "./link/link.module";
import {Link} from "./link/link.entity";
import {Call} from "./link/call/call.entity";
import {CallModule} from "./link/call/call.module";
import {MailerModule} from "@nestjs-modules/mailer";
import {HandlebarsAdapter} from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import * as path from 'path';
import {ReportModule} from "./link/report/report.module";
import {Report} from "./link/report/report.entity";

require('dotenv').config();

const _password = process.env.MAIL_DEINLI_PASSWORD;
const _mail = process.env.MAIL_DEINLI;

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            timezone: '+01:00',
            entities: [Link, Call, Report],
            synchronize: true
        }),
        MailerModule.forRoot({
            transport: 'smtps://' + _mail + ':' + _password + '@cp.dankoe.de',
            defaults: {
                from: '"Seba Momann" <' + _mail + '>',
            },
            template: {
                dir: path.resolve(__dirname, 'templates'),
                adapter: new HandlebarsAdapter(), // or new PugAdapter()
                options: {
                    strict: true,
                },
            },
        }),
        UserModule,
        LinkModule,
        CallModule,
        ReportModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
