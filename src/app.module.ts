import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';

import {TypeOrmModule} from '@nestjs/typeorm';
import {UserModule} from "./user/user.module";
import {LinkModule} from "./modules/link/link.module";
import {CallModule} from "./modules/link/call/call.module";
import {MailerModule} from "@nestjs-modules/mailer";
import {HandlebarsAdapter} from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import * as path from 'path';
import {ReportModule} from "./modules/link/report/report.module";
import {GlobalModule} from './modules/global/global.module';
import {AuthModule} from "./auth/auth.module";
import {Connection} from "typeorm";

require('dotenv').config();

const _password = process.env.MAIL_DEINLI_PASSWORD;
const _mail = process.env.MAIL_DEINLI;

@Module({
    imports: [
        TypeOrmModule.forRoot(),
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
        GlobalModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    constructor(private connection: Connection) {
    }
}
