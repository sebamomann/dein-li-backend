import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UserService} from '../user/user.service';
import {JwtService} from '@nestjs/jwt';
import {User} from '../user/user.entity';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcryptjs');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const userMapper = require('../user/user.mapper');

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService,
                private readonly jwtService: JwtService) {
    }

    public async login(value: string, pass: string): Promise<any> {
        let user;

        try {
            user = await this.userService.findByEmailOrUsername(value);
        } catch (e) {
            throw new UnauthorizedException({
                code: 'INVALID_CREDENTIALS',
                message: 'Invalid password or username',
            });
        }

        if (user.activated) {
            if (await bcrypt.compare(pass, user.password)) {
                const session = await this.userService.createSession(user);

                user.session = {};
                user.session.refreshToken = session.refreshToken;

                return userMapper.basic(this.userService, user);
            } else {
                // const passwordChangeDate = await this.userService.getLastValidityDateOfPassword(user, pass);

                // if (passwordChangeDate != null) {
                //     throw new UnauthorizedException({
                //         code: 'INVALID_PASSWORD',
                //         message: 'This password has been changed',
                //         data: new Date(passwordChangeDate)
                //     });
                // } else {
                throw new UnauthorizedException({
                    code: 'INVALID_CREDENTIALS',
                    message: 'Invalid password or username',
                });
                // }
            }
        } else {
            throw new UnauthorizedException({
                code: 'ACCOUNT_LOCK',
                message: 'This account has not been activated yet',
                data: 'NOT_ACTIVATED'
            });
        }
    }

    public addJwtToObject(user: User) {
        /* change here for more data | and in jwt strategy */
        const payload = {sub: user.id, mail: user.mail, username: user.username};
        user.session.token = this.jwtService.sign(payload);

        return user;
    }

    public async generateAccessToken(data: { user: { id: string }; refreshToken: string }) {
        let user;

        try {
            user = await this.userService.findById(data.user.id);
        } catch (e) {
            throw e;
        }

        try {
            await this.userService.sessionExists(data.refreshToken, data.user.id);
        } catch (e) {
            throw new UnauthorizedException();
        }

        const _user = userMapper.basic(this.userService, user);

        this.addJwtToObject(_user);

        _user.session.refreshToken = data.refreshToken;

        return _user;
    }
}
