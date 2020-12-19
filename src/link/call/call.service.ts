import {Injectable} from '@nestjs/common';
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {Call} from "./call.entity";
import {CallSuccessful} from "./callSuccessful.entity";
import {CallLocked} from "./callLocked.entity";
import {CallUndefined} from "./callundefined.entity";
import {Link} from "../link.entity";

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
}
