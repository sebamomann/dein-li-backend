import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    Post,
    Request,
    Res,
    UnauthorizedException,
    UseGuards
} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {EntityNotFoundException} from './exceptions/EntityNotFoundException';
import {AuthService} from "./auth/auth.service";
import {LinkService} from "./link/link.service";
import {CallService} from "./link/call/call.service";

require('dotenv').config();

@Controller()
export class AppController {
    constructor(private readonly authService: AuthService,
                private readonly  linkService: LinkService,
                private readonly  callService: CallService) {
    }

    @Get('healthcheck')
    async health(@Request() req,
                 @Res() res) {
        return res.status(HttpStatus.OK).json();
    }

    @Post('auth/login')
    @UseGuards(AuthGuard('local'))
    async login(@Request() req,
                @Res() res) {

        if (req.user instanceof Date) {
            const error: any = {};
            error.code = 'OLD_PASSWORD';
            error.message = 'This password has been changed at ' + req.user;
            error.data = req.user;

            return res.status(HttpStatus.UNAUTHORIZED).json(error);
        }

        const _user = await this.authService.addJwtToObject(req.user);

        return res.status(HttpStatus.OK).json(_user);
    }

    @Post('auth/token')
    generateAccessToken(@Body() data: { user: { id: string }, refreshToken: string },
                        @Res() res,) {
        return this.authService
            .generateAccessToken(data)
            .then((result) => {
                res.status(HttpStatus.CREATED).json(result);
            })
            .catch((err) => {
                if (err instanceof EntityNotFoundException || err instanceof UnauthorizedException) {
                    res.status(HttpStatus.UNAUTHORIZED).json({
                        code: 'UNAUTHORIZED',
                        message: `Missing or invalid Authentication`,
                        date: new Date(Date.now())
                    });
                } else {
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                        code: 'UNDEFINED',
                        message: `An undefined error occurred. Please try again`,
                        date: new Date(Date.now())
                    });
                }
            });
    }

    @Get(':short?')
    async redirect(@Request() req,
                   @Param('short') short: string,
                   @Res() res) {
        if (!short) {
            res.set('location', process.env.DOMAIN + "?success=true&type=default");
        } else {
            try {
                const link = await this.linkService.getLinkByShort(short);

                if (link.isActive === 1) {
                    this.callService.manageLinkCall(link, 1, req.headers['user-agent']);
                    res.set('location', link.original);
                } else if (link.isActive === -2) {
                    this.callService.manageLinkCall(link, -2, req.headers['user-agent']);
                    res.set('location', process.env.DOMAIN + "/redirect?success=false&error=locked");
                } else {
                    this.callService.manageLinkCall(link, null, req.headers['user-agent']);
                    res.set('location', process.env.DOMAIN + "/redirect?success=false&error=unknown");
                }
            } catch (e) {
                res.set('location', process.env.DOMAIN + "/redirect?success=false&error=not_found");
            }
        }

        return res.status(HttpStatus.TEMPORARY_REDIRECT).json();
    }
}
