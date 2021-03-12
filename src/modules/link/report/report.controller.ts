import {Body, Controller, HttpStatus, Post, Res, UseInterceptors} from '@nestjs/common';
import {Usr} from "../../../user/user.decorator";
import {Response} from "express";
import {ReportService} from "./report.service";
import {BusinessToHttpExceptionInterceptor} from "../../../interceptor/BusinessToHttpException.interceptor";
import {User} from "../../../user/user.model";

@Controller('report')
@UseInterceptors(BusinessToHttpExceptionInterceptor)
export class ReportController {

    constructor(private reportService: ReportService) {
    }

    @Post()
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
