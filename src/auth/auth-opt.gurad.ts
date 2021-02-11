import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {AuthGuard} from "./auth.gurad";
import {User} from "../user/user.model";

@Injectable()
export class AuthOptGuard implements CanActivate {
    constructor(private guard: AuthGuard) {
    }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        if (request.headers.authorization) {
            return await this.guard.canActivate(context);
        } else {
            request.user = new User();
        }

        return true;
    }
}
