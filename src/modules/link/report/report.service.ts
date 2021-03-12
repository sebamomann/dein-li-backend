import {Injectable} from '@nestjs/common';
import {LinkService} from "../link.service";
import {Report} from "./report.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User} from "../../../user/user.model";

@Injectable()
export class ReportService {
    constructor(private readonly linkService: LinkService,
                @InjectRepository(Report)
                private readonly reportRepository: Repository<Report>,) {

    }

    public async report(short: string, user: User) {
        const link = await this.linkService.getLinkByShort(short);

        const report = new Report();
        report.link = link;
        report.userId = user ? user.sub : null;
        report.isConfirmation = false;

        return await this.reportRepository.save(report);
    }
}
