import {Module} from '@nestjs/common';
import {ReportController} from './report.controller';
import {ReportService} from './report.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Report} from "./report.entity";
import {LinkModule} from "../link.module";

@Module({
    imports: [TypeOrmModule.forFeature([Report]), LinkModule],
    controllers: [ReportController],
    providers: [ReportService],
    exports: [ReportService]
})
export class ReportModule {
}
