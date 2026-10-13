import {Module} from "@nestjs/common";
import {HttpModule} from "@nestjs/axios";
import {AuthGuard} from "./auth.gurad";
import {AuthOptGuard} from "./auth-opt.gurad";

@Module({
    imports: [HttpModule],
    controllers: [],
    providers: [AuthGuard, AuthOptGuard],
    exports: [AuthGuard, AuthOptGuard]
})
export class AuthModule {
}
