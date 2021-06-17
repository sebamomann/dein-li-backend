import {HttpModule, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Link} from "./link.entity";
import {LinkService} from "./link.service";
import {LinkController} from "./link.controller";
import {UserModule} from "../../user/user.module";
import {CallModule} from "./call/call.module";
import {AuthModule} from "../../auth/auth.module";
import {LinkPermission} from './link-permission.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Link, LinkPermission]), UserModule, CallModule, AuthModule, HttpModule],
    providers: [LinkService],
    exports: [LinkService],
    controllers: [LinkController],
})
export class LinkModule {
}
