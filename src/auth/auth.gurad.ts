import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import {HttpService} from '@nestjs/axios';
import {firstValueFrom} from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private httpService: HttpService) {
    }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const url = `${process.env.KEYCLOAK_URL}auth/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/userinfo`;

        try {
            const response = await firstValueFrom(this.httpService.get<any>(url, {
                headers: {
                    authorization: `${request.headers.authorization}`,
                },
            }));

            request.user = response.data;

            return true;
        } catch (e) {
            console.log(e);

            throw new UnauthorizedException("Missing or invalid Authorization header");
        }
    }
}
