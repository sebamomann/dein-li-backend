import {Body, Controller, HttpStatus, Post, Res, UseGuards, UseInterceptors} from '@nestjs/common';
import {JwtOptStrategy} from "../../auth/jwt-opt.strategy";
import {Usr} from "../../user/user.decorator";
import {User} from "../../user/user.entity";
import {Response} from "express";
import {ReportService} from "./report.service";
import {BusinessToHttpExceptionInterceptor} from "../../interceptor/BusinessToHttpException.interceptor";

@Controller('report')
@UseInterceptors(BusinessToHttpExceptionInterceptor)
export class ReportController {

    constructor(private reportService: ReportService) {
    }

    @Post()
    @UseGuards(JwtOptStrategy)
    report(@Usr() user: User,
           @Body("short") short: string,
           @Res() res: Response,) {
        return this.reportService
            .report(short, user)
            .then(tReport => {
                res.status(HttpStatus.CREATED).json(tReport);
            })
            .catch((err) => {
                throw err;
            });
    }
}
