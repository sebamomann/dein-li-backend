import {Body, Controller, HttpStatus, Param, Post, Res, UseGuards, UseInterceptors} from '@nestjs/common';

import {Usr} from '../user/user.decorator';
import {User} from "../user/user.entity";

import {Link} from "./link.entity";
import {LinkService} from "./link.service";

import {AuthGuard} from '@nestjs/passport';

import {Response} from 'express';
import {BusinessToHttpExceptionInterceptor} from "../interceptor/BusinessToHttpException.interceptor";

@Controller('link')
@UseInterceptors(BusinessToHttpExceptionInterceptor)
export class LinkController {

    constructor(private linkService: LinkService) {
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    create(@Usr() user: User,
           @Body() link: Link,
           @Res() res: Response,) {
        return this.linkService
            .create(link, user)
            .then(tLink => {
                res.status(HttpStatus.CREATED).json(tLink);
            })
            .catch((err) => {
                throw err;
            });
    }

    @Post(':short/version')
    @UseGuards(AuthGuard('jwt'))
    newVersion(@Usr() user: User,
               @Param('short') short: string,
               @Body() link: Link,
               @Res() res: Response,) {
        return this.linkService
            .newVersion(link, short, user)
            .then(tLink => {
                res.status(HttpStatus.CREATED).json(tLink);
            })
            .catch((err) => {
                throw err;
            });
    }
}
