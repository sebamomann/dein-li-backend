import {HttpModule, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Link} from "./link.entity";
import {LinkService} from "./link.service";
import {LinkController} from "./link.controller";
import {UserModule} from "../user/user.module";
import {CallModule} from "./call/call.module";
import {AuthGuard} from "../auth/auth.gurad";

@Module({
    imports: [TypeOrmModule.forFeature([Link]), UserModule, CallModule, HttpModule],
    providers: [LinkService, AuthGuard],
    exports: [LinkService],
    controllers: [LinkController],
})
export class LinkModule {
}
