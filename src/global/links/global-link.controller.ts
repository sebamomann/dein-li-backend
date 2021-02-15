import {Controller, Get, HttpStatus, Param, Query, Res, UseGuards} from '@nestjs/common';
import {AuthOptGuard} from "../../auth/auth-opt.gurad";
import {Usr} from "../../user/user.decorator";
import {User} from "../../user/user.model";
import {Response} from "express";
import {LinkService} from "../../link/link.service";

@Controller('global/links')
export class GlobalLinkController {
    constructor(private linkService: LinkService) {
    }

    @Get('statistics')
    @UseGuards(AuthOptGuard)
    getHistoryStats(@Usr() user: User,
                    @Param('short') short: string,
                    @Query('start') start: string,
                    @Query('end') end: string,
                    @Query('interval') interval: "minutes" | "hours" | "days" | "months",
                    @Res() res: Response,) {
        return this.linkService
            .getStatsAll(user, interval, start, end)
            .then(tLink => {
                res.status(HttpStatus.OK).json(tLink);
            })
            .catch((err) => {
                throw err;
            });
    }
}
