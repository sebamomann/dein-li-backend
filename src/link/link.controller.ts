import {Body, Controller, HttpStatus, Post, Res, UseGuards} from '@nestjs/common';

import {Usr} from '../user/user.decorator';
import {User} from "../user/user.entity";

import {Link} from "./link.entity";
import {LinkService} from "./link.service";

import {AuthGuard} from '@nestjs/passport';

import {Response} from 'express';

@Controller('link')
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

    @Post('version')
    @UseGuards(AuthGuard('jwt'))
    newVersion(@Usr() user: User,
               @Body() link: Link,
               @Res() res: Response,) {
        return this.linkService
            .newVersion(link, user)
            .then(tLink => {
                res.status(HttpStatus.CREATED).json(tLink);
            })
            .catch((err) => {
                throw err;
            });
    }
}
