import {Injectable} from '@nestjs/common';
import {Between, Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {Call} from "./call.entity";
import {CallSuccessful} from "./callSuccessful.entity";
import {CallLocked} from "./callLocked.entity";
import {CallUndefined} from "./callundefined.entity";
import {Link} from "../link.entity";
import {subDays} from 'date-fns';
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

    public async getStats(link: Link): Promise<IStats> {
        const totalCalls = await this.callRepository.count({where: {link}});

        let distinctCalls = await this.callRepository.createQueryBuilder('call')
            .select("COUNT(DISTINCT call.agent) AS count")
            .where("call.linkId = :linkId", {linkId: link.id})
            .getRawOne();

        distinctCalls = distinctCalls.count;

        const d = new Date();
        d.setDate(d.getDate() - 1);

        const pastDay = await this.callRepository.createQueryBuilder('call')
            .select("HOUR(call.iat) as hour, COUNT(*) as count")
            .where("call.linkId = :linkId", {linkId: link.id})
            .andWhere("call.iat > :iat", {iat: d})
            .groupBy("HOUR(call.iat)")
            .execute();

        const pastDayByHours = [];

        for (let i = 0; i < 24; i++) {
            const call = pastDay.find(fElem => fElem.hour === i);
            let calls = 0;

            if (call) {
                calls = call.count;
            }
            pastDayByHours.push({hour: i, calls: calls > 0 ? calls : 0})
        }

        return {
            total: totalCalls,
            distinctCalls,
            calls: pastDayByHours,
            format: "hour_one_day"
        }
    }
}
