import {Module} from '@nestjs/common';
import {GlobalController} from './global.controller';
import {LinkModule} from "../link/link.module";
import {AuthModule} from "../auth/auth.module";
import {GlobalLinkController} from "./links/global-link.controller";

@Module({
    imports: [LinkModule, AuthModule],
    controllers: [GlobalController, GlobalLinkController]
})
export class GlobalModule {
}
