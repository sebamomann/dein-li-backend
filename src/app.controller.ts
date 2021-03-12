import {Controller, Get, HttpStatus, Param, Request, Res} from '@nestjs/common';
import {LinkService} from "./modules/link/link.service";
import {CallService} from "./modules/link/call/call.service";

@Controller()
export class AppController {
    constructor(private linkService: LinkService, private callService: CallService) {
        //
    }

    @Get('healthcheck')
    async health(@Request() req,
                 @Res() res) {
        return res.status(HttpStatus.OK).json();
    }

    @Get('redirect/:short')
    async redirect(@Request() req,
                   @Param('short') short: string,
                   @Res() res) {
        if (!short) {
            res.set('location', process.env.DOMAIN + "?success=true&type=default");
        } else if (short.endsWith("~")) {
            const url = process.env.DOMAIN + "link?l=" + short.substr(0, short.length - 1) + "&type=preview";
            res.set('location', url);
        } else {
            try {
                const link = await this.linkService.getLinkByShortAndReports(short);

                if (link.isActive === 1) {
                    if (link.reports?.length > 0) {
                        res.set('location', process.env.DOMAIN + "redirect?success=false&error=threat&short=" + short);
                    } else {
                        this.callService.manageLinkCall(link, 1, req.headers['user-agent']);
                        res.set('location', link.original);
                    }
                } else if (link.isActive === -2) {
                    this.callService.manageLinkCall(link, -2, req.headers['user-agent']);
                    res.set('location', process.env.DOMAIN + "redirect?success=false&error=locked");
                } else {
                    this.callService.manageLinkCall(link, null, req.headers['user-agent']);
                    res.set('location', process.env.DOMAIN + "redirect?success=false&error=unknown");
                }
            } catch (e) {
                res.set('location', process.env.DOMAIN + "redirect?success=false&error=not_found");
            }
        }

        return res.status(HttpStatus.TEMPORARY_REDIRECT).json();
    }
}
