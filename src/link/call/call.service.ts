import {Injectable} from '@nestjs/common';
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {Call} from "./call.entity";
import {CallSuccessful} from "./callSuccessful.entity";
import {CallLocked} from "./callLocked.entity";
import {CallUndefined} from "./callundefined.entity";
import {Link} from "../link.entity";
import {IStats} from "../IStats.model";

@Injectable()
export class CallService {
    constructor(
        @InjectRepository(Call)
        private readonly callRepository: Repository<Call>,
    ) {
    }

    public manageLinkCall(link: Link, number: number, agent: string) {
        let call: Call;

        if (number === 1) {
            call = new CallSuccessful(link);
        } else if (number === -2) {
            call = new CallLocked(link);
        } else {
            call = new CallUndefined(link);
        }

        call.agent = agent;

        this.callRepository.save(call).then();
    }

    public async getStats(link: Link, interval: "minutes" | "hours" | "days" | "months", start: string, end: string): Promise<IStats> {
        const totalCalls = await this.getTotalCallsByShort(link);
        const distinctCalls = await this.getDistinctCallsByShort(link);
        const pastDayByHours = await this.getStatsByShort(link, interval, start, end);

        return {
            total: totalCalls,
            distinctCalls,
            calls: pastDayByHours,
            format: "hour_one_day"
        }
    }

    public async getStatsPreview(link: Link): Promise<IStats> {
        const totalCalls = await this.getTotalCallsByShort(link);
        const distinctCalls = await this.getDistinctCallsByShort(link);

        return {
            total: totalCalls,
            distinctCalls,
        }
    }

    public async getStatsTotal(interval: "minutes" | "hours" | "days" | "months", start: string, end: string): Promise<IStats> {
        let totalCalls = await this.callRepository.createQueryBuilder('call')
            .select("COUNT(*) AS count")
            .getRawOne();

        totalCalls = totalCalls.count;

        let distinctCalls = await this.callRepository.createQueryBuilder('call')
            .select("COUNT(DISTINCT call.agent) AS count")
            .getRawOne();

        distinctCalls = distinctCalls.count;

        const past = await this.getStatsAll(interval, start, end);


        return {
            total: totalCalls,
            distinctCalls,
            calls: past,
            format: "hour_one_day"
        }
    }

    private async getStatsAll(interval: "minutes" | "hours" | "days" | "months", start: string, end: string) {
        let dStart;

        if (!start) {
            dStart = new Date();
            dStart.setDate(dStart.getDate() - 1);
            dStart = new Date(dStart.setTime(dStart.getTime() + (1 * 60 * 60 * 1000)));
        } else {
            dStart = new Date(start);
        }

        let dEnd;

        if (!end) {
            dEnd = new Date();
        } else {
            dEnd = new Date(end);
        }
        let past;


        switch (interval) {
            case "days":
                past = this.getAllByDays(dStart, dEnd);
                break;
            case "hours":
                past = this.getAllByHours(dStart, dEnd);
                break;
            case "minutes":
                past = this.getAllByMinutes(dStart, dEnd);
                break;
            case "months":
                past = this.getAllByMonths(dStart, dEnd);
                break;
            default:
                past = this.getAllByHours(dStart, dEnd);
        }

        return past;
    }


    private async getStatsByShort(link: Link, interval: "minutes" | "hours" | "days" | "months", start: string, end: string) {
        let dStart;

        if (!start) {
            dStart = new Date();
            dStart.setDate(dStart.getDate() - 1);
            dStart = new Date(dStart.setTime(dStart.getTime() + (1 * 60 * 60 * 1000)));
        } else {
            dStart = new Date(start);
        }

        let dEnd;

        if (!end) {
            dEnd = new Date();
        } else {
            dEnd = new Date(end);
        }
        let past;


        switch (interval) {
            case "days":
                past = this.getByDays(link, dStart, dEnd);
                break;
            case "hours":
                past = this.getByHours(link, dStart, dEnd);
                break;
            case "minutes":
                past = this.getByMinutes(link, dStart, dEnd);
                break;
            case "months":
                past = this.getByMonths(link, dStart, dEnd);
                break;
            default:
                past = this.getByHours(link, dStart, dEnd);
        }

        return past;
    }

    private async getByHours(link: Link, start: Date, end: Date) {
        let past = await this.callRepository.createQueryBuilder('call')
            .select("call.iat, COUNT(*) as count")
            .innerJoin("call.link", "link")
            .where("link.short = :short", {short: link.short})
            .andWhere("call.iat > :start", {start: start})
            .andWhere("call.iat < :end", {end: end})
            .groupBy("YEAR(call.iat), MONTH(call.iat), DAY(call.iat), HOUR(call.iat)")
            .execute();

        past = past.map((mPastDay) => {
            const iat = new Date(mPastDay.iat.getFullYear(), mPastDay.iat.getMonth(), mPastDay.iat.getDate(), mPastDay.iat.getHours(), 0, 0);
            mPastDay.iat = iat;

            return mPastDay;
        })

        return past;
    }

    private async getByMinutes(link: Link, start: Date, end: Date) {
        let past = await this.callRepository.createQueryBuilder('call')
            .select("call.iat, COUNT(*) as count")
            .innerJoin("call.link", "link")
            .where("link.short = :short", {short: link.short})
            .andWhere("call.iat > :start", {start: start})
            .andWhere("call.iat < :end", {end: end})
            .groupBy("YEAR(call.iat), MONTH(call.iat), DAY(call.iat), HOUR(call.iat), MINUTE(call.iat)")
            .execute();

        past = past.map((mPastDay) => {
            const iat = new Date(mPastDay.iat.getFullYear(), mPastDay.iat.getMonth(), mPastDay.iat.getDate(), mPastDay.iat.getHours(), mPastDay.iat.getMinutes(), 0);
            mPastDay.iat = iat;

            return mPastDay;
        })

        return past;
    }

    private async getByDays(link: Link, start: Date, end: Date) {
        let past = await this.callRepository.createQueryBuilder('call')
            .select("call.iat, COUNT(*) as count")
            .innerJoin("call.link", "link")
            .where("link.short = :short", {short: link.short})
            .andWhere("call.iat > :start", {start: start})
            .andWhere("call.iat < :end", {end: end})
            .groupBy("YEAR(call.iat), MONTH(call.iat), DAY(call.iat)")
            .execute();

        past = past.map((mPastDay) => {
            const iat = new Date(mPastDay.iat.getFullYear(), mPastDay.iat.getMonth(), mPastDay.iat.getDate(), 0, 0, 0);
            mPastDay.iat = iat;

            return mPastDay;
        })

        return past;
    }

    private async getByMonths(link: Link, start: Date, end: Date) {
        let past = await this.callRepository.createQueryBuilder('call')
            .select("call.iat, COUNT(*) as count")
            .innerJoin("call.link", "link")
            .where("link.short = :short", {short: link.short})
            .andWhere("call.iat > :start", {start: start})
            .andWhere("call.iat < :end", {end: end})
            .groupBy("YEAR(call.iat), MONTH(call.iat)")
            .execute();

        past = past.map((mPastDay) => {
            const iat = new Date(mPastDay.iat.getFullYear(), mPastDay.iat.getMonth(), 0, 0, 0, 0);
            mPastDay.iat = iat;

            return mPastDay;
        })

        return past;
    }

    private async getAllByHours(start: Date, end: Date) {
        let past = await this.callRepository.createQueryBuilder('call')
            .select("call.iat, COUNT(*) as count")
            .where("call.iat > :start", {start: start})
            .andWhere("call.iat < :end", {end: end})
            .groupBy("YEAR(call.iat), MONTH(call.iat), DAY(call.iat), HOUR(call.iat)")
            .execute();

        past = past.map((mPastDay) => {
            const iat = new Date(mPastDay.iat.getFullYear(), mPastDay.iat.getMonth(), mPastDay.iat.getDate(), mPastDay.iat.getHours(), 0, 0);
            mPastDay.iat = iat;

            return mPastDay;
        })

        return past;
    }

    private async getAllByMinutes(start: Date, end: Date) {
        let past = await this.callRepository.createQueryBuilder('call')
            .select("call.iat, COUNT(*) as count")
            .where("call.iat > :start", {start: start})
            .andWhere("call.iat < :end", {end: end})
            .groupBy("YEAR(call.iat), MONTH(call.iat), DAY(call.iat), HOUR(call.iat), MINUTE(call.iat)")
            .execute();

        past = past.map((mPastDay) => {
            const iat = new Date(mPastDay.iat.getFullYear(), mPastDay.iat.getMonth(), mPastDay.iat.getDate(), mPastDay.iat.getHours(), mPastDay.iat.getMinutes(), 0);
            mPastDay.iat = iat;

            return mPastDay;
        })

        return past;
    }

    private async getAllByDays(start: Date, end: Date) {
        let past = await this.callRepository.createQueryBuilder('call')
            .select("call.iat, COUNT(*) as count")
            .where("call.iat > :start", {start: start})
            .andWhere("call.iat < :end", {end: end})
            .groupBy("YEAR(call.iat), MONTH(call.iat), DAY(call.iat)")
            .execute();

        past = past.map((mPastDay) => {
            const iat = new Date(mPastDay.iat.getFullYear(), mPastDay.iat.getMonth(), mPastDay.iat.getDate(), 0, 0, 0);
            mPastDay.iat = iat;

            return mPastDay;
        })

        return past;
    }

    private async getAllByMonths(start: Date, end: Date) {
        let past = await this.callRepository.createQueryBuilder('call')
            .select("call.iat, COUNT(*) as count")
            .where("call.iat > :start", {start: start})
            .andWhere("call.iat < :end", {end: end})
            .groupBy("YEAR(call.iat), MONTH(call.iat)")
            .execute();

        past = past.map((mPastDay) => {
            const iat = new Date(mPastDay.iat.getFullYear(), mPastDay.iat.getMonth(), 0, 0, 0, 0);
            mPastDay.iat = iat;

            return mPastDay;
        })

        return past;
    }


    private async getDistinctCallsByShort(link: Link) {
        let distinctCalls = await this.callRepository.createQueryBuilder('call')
            .select("COUNT(DISTINCT call.agent) AS count")
            .innerJoin("call.link", "link")
            .where("link.short = :short", {short: link.short})
            .getRawOne();

        distinctCalls = distinctCalls.count;
        return distinctCalls;
    }

    private async getTotalCallsByShort(link: Link) {
        let totalCalls = await this.callRepository.createQueryBuilder('call')
            .select("COUNT(*) AS count")
            .innerJoin("call.link", "link")
            .where("link.short = :short", {short: link.short})
            .getRawOne();

        totalCalls = totalCalls.count;
        return totalCalls;
    }
}
