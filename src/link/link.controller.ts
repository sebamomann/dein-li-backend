import {Body, Controller, Get, HttpStatus, Param, Post, Query, Res, UseGuards, UseInterceptors} from '@nestjs/common';

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

    @Get('/all')
    @UseGuards(AuthGuard('jwt'))
    getAll(@Usr() user: User,
           @Query('order_by') orderBy: string,
           @Query('order') order: "ASC" | "DESC",
           @Res() res: Response,) {
        return this.linkService
            .getAll(user, orderBy, order)
            .then(tLink => {
                res.status(HttpStatus.OK).json(tLink);
            })
            .catch((err) => {
                throw err;
            });
    }


    @Get(':short?')
    getLinkByShort(@Param('short') short: string,
                   @Res() res: Response,) {
        return this.linkService
            .get(short)
            .then(tLink => {
                res.status(HttpStatus.OK).json(tLink);
            })
            .catch((err) => {
                throw err;
            });
    }

    @Get('all/history')
    getHistoryStatsAll(@Param('short') short: string,
                       @Res() res: Response,) {
        return this.linkService
            .getHistoryStats("all", undefined)
            .then(tLink => {
                res.status(HttpStatus.OK).json(tLink);
            })
            .catch((err) => {
                throw err;
            });
    }

    @Get(':short/history')
    @UseGuards(AuthGuard('jwt'))
    getHistoryStats(@Usr() user: User,
                    @Param('short') short: string,
                    @Res() res: Response,) {
        return this.linkService
            .getHistoryStats(short, user)
            .then(tLink => {
                res.status(HttpStatus.OK).json(tLink);
            })
            .catch((err) => {
                throw err;
            });
    }

    @Get(':short/version')
    @UseGuards(AuthGuard('jwt'))
    getVersions(@Usr() user: User,
                @Param('short') short: string,
                @Res() res: Response,) {
        return this.linkService
            .getVersions(short, user)
            .then(tLink => {
                res.status(HttpStatus.OK).json(tLink);
            })
            .catch((err) => {
                throw err;
            });
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
