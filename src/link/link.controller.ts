import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    Res,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';

import {Usr} from '../user/user.decorator';
import {User} from "../user/user.model";

import {Link} from "./link.entity";
import {LinkService} from "./link.service";

import {Response} from 'express';
import {BusinessToHttpExceptionInterceptor} from "../interceptor/BusinessToHttpException.interceptor";
import {AuthGuard} from "../auth/auth.gurad";
import {AuthOptGuard} from "../auth/auth-opt.gurad";

@Controller('links')
@UseInterceptors(BusinessToHttpExceptionInterceptor)
export class LinkController {

    constructor(private linkService: LinkService) {
    }


    @Get()
    getAll(@Usr() user: User,
           @Query('order_by') orderBy: string,
           @Query('order') order: "ASC" | "DESC",
           @Query('limit') limit: number,
           @Query('offset') offset: number,
           @Res() res: Response,) {
        return this.linkService
            .getAll(user, orderBy, order, limit, offset)
            .then(tLink => {
                res.status(HttpStatus.OK).json(tLink);
            })
            .catch((err) => {
                throw err;
            });
    }

    @Post()
    create(@Usr() user: User,
           @Body() link: Link,
           @Res() res: Response,) {
        return this.linkService
            .create(link, user)
            .then(tLink => {
                res.header("Location", `${process.env.API_URL}/links/${tLink.short}`)
                res.status(HttpStatus.CREATED).json(tLink);
            })
            .catch((err) => {
                throw err;
            });
    }

    @Get(':short')
    @UseGuards(AuthGuard)
    getLinkByShort(@Usr() user: User,
                   @Param('short') short: string,
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

    @Put(':short')
    // @UseGuards(AuthGuard('jwt'))
    newVersion(@Usr() user: User,
               @Param('short') short: string,
               @Body() link: Link,
               @Res() res: Response,) {
        return this.linkService
            .newVersion(link, short, user)
            .then(() => {
                res.status(HttpStatus.NO_CONTENT).send();
            })
            .catch((err) => {
                throw err;
            });
    }

    @Get(':short/versions')
    // @UseGuards(AuthGuard('jwt'))
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

    @Get(':short/history')
    @UseGuards(AuthOptGuard)
    getHistoryStats(@Usr() user: User,
                    @Param('short') short: string,
                    @Query('start') start: string,
                    @Query('end') end: string,
                    @Query('interval') interval: "minutes" | "hours" | "days" | "months",
                    @Res() res: Response,) {
        return this.linkService
            .getHistoryStats(short, user, interval, start, end)
            .then(tLink => {
                res.status(HttpStatus.OK).json(tLink);
            })
            .catch((err) => {
                console.log(err);
                throw err;
            });
    }
}
