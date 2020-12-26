import {Injectable, UnauthorizedException} from '@nestjs/common';
import {Link} from "./link.entity";
import {User} from "../user/user.entity";
import {InvalidAttributesException} from "../exceptions/InvalidAttributesException";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";

import {AlreadyUsedException} from "../exceptions/AlreadyUsedException";
import {EntityNotFoundException} from "../exceptions/EntityNotFoundException";
import {InsufficientPermissionsException} from "../exceptions/InsufficientPermissionsException";
import {CallService} from "./call/call.service";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const validUrl = require("valid-url");

// eslint-disable-next-line @typescript-eslint/no-var-requires
const linkMapper = require("./link.mapper");

// eslint-disable-next-line @typescript-eslint/no-var-requires
const randomstring = require("randomstring");

@Injectable()
export class LinkService {
    constructor(
        @InjectRepository(Link)
        private readonly linkRepository: Repository<Link>,
        private callService: CallService
    ) {
    }

    private static generateLink(): string {
        return randomstring.generate(7);
    }

    public async create(link: Link, user: User): Promise<Link> {
        let linkToDb = new Link();


        if (!validUrl.isUri(link.original)) {
            throw new InvalidAttributesException(null,
                "Given URL can not be processed. Specify a valid URL", [
                    {
                        "attribute": "original",
                        "value": link.original
                    }
                ]);
        }

        linkToDb.original = link.original;
        linkToDb.creator = user;
        linkToDb.short = await this.linkGenerationAndDuplicateCheck(link.short);

        linkToDb = await this.linkRepository.save(linkToDb);

        return linkMapper.basic(linkToDb);
    }

    public async newVersion(link: Link, short: string, user: User): Promise<Link> {
        let linkToDb = new Link();

        if (!validUrl.isUri(link.original)) {
            throw new InvalidAttributesException(null,
                "Given URL can not be processed. Specify a valid URL", [
                    {
                        "attribute": "original",
                        "value": link.original
                    }
                ]);
        }

        const existingVersion = await this.isAllowedToGenerateNewVersion(short, user)
        existingVersion.isActive = -1;
        this.linkRepository.save(existingVersion).then();

        linkToDb.short = existingVersion.short;
        linkToDb.creator = existingVersion.creator;
        linkToDb.original = link.original;

        linkToDb = await this.linkRepository.save(linkToDb);

        return linkToDb;
    }

    public async getLinkByShort(short: string) {
        const link = await this.linkRepository.findOne({
            where: {
                short,
                isActive: 1
            }
        });

        if (link === undefined) {
            throw new EntityNotFoundException(null, null, 'link');
        }

        return link;
    }

    public async get(short: string): Promise<Link> {
        const link = await this.getLinkByShort(short);

        return linkMapper.basic(link);
    }

    public async getHistoryStats(short: string, user: User) {
        let stats;

        if (short !== "all") {
            stats = await this.getLinkStatsByShort(short, user);
        } else {
            stats = await this.getLinkStatsTotal();
        }

        return stats;
    }

    public async getVersions(short: string, user: User) {
        let links = await this.linkRepository.find({where: {short, creator: user}, order: {iat: "DESC"}})

        links = links.map((mLink) => {
            return linkMapper.basic(mLink)
        });

        return links;
    }

    public async getAll(user: User, orderBy: string, order: "ASC" | "DESC") {
        let val: Link[];
        if (!orderBy) {
            val = await this.getAllOrderByIat(user, "DESC");
        } else {
            if (order !== "ASC" && order !== "DESC") {
                order = "DESC";
            }

            switch (orderBy) {
                case "calls":
                    val = await this.getAllOrderByCalls(user, order);
                    break;
                case "iat":
                    val = await this.getAllOrderByIat(user, order);
                    break;
                case "calls_version":
                    val = await this.getAllOrderByCallsVersion(user, order);
                    break;
                default:
                    val = await this.getAllOrderByIat(user, order);
            }
        }

        val = val.map((mVal) => linkMapper.basic(mVal));

        return val;
    }

    private async getLinkStatsByShort(short: string, user: User) {
        const link = await this.getLinkByShort(short);

        if (link.creator.id !== user.id) {
            throw new UnauthorizedException();
        } else {
            return await this.callService.getStats(link);
        }
    }

    private async getLinkStatsTotal() {
        return await this.callService.getStatsTotal();
    }

    private async linkGenerationAndDuplicateCheck(short: string): Promise<string> {
        if (short) {
            if (!short.match(new RegExp("^[a-zA-Z0-9\-\_]*$"))) {
                throw new InvalidAttributesException(null,
                    "The specified short Link has a invalid Format. The required Format is '^[a-zA-Z0-9\-\_]*$'", [{
                        "attribute": "short",
                        "value": short
                    }])
            }

            if (await this.linkInUse(short)) {
                throw new AlreadyUsedException(null,
                    "The specified short Link is already taken. Please specify a new one", [{
                        "attribute": "short",
                        "value": short
                    }])
            }
        } else {
            do {
                short = LinkService.generateLink();
            } while (await this.linkInUse(short))
        }


        return short;
    }

    private async linkInUse(short: string) {
        const link = await this.linkRepository.findOne({
            where: {
                short
            }
        });

        return link !== undefined;
    }

    private async isAllowedToGenerateNewVersion(short: string, user: User) {
        const _link = await this.getLinkByShort(short);

        if (_link.creator.username !== user.username) {
            throw new InsufficientPermissionsException(null,
                "Missing permissions to generate new version for specified Link", [
                    {
                        "attribute": "short",
                        "value": short
                    }
                ]);
        }

        return _link;
    }

    private async getAllOrderByIat(user: User, order: "ASC" | "DESC") {
        return await this.linkRepository
            .createQueryBuilder("link")
            .select('*')
            .where("creatorId = :userId", {
                userId: user.id
            })
            .orderBy({iat: order})
            .groupBy("short")
            .getRawMany();
    }

    private async getAllOrderByCalls(user: User, order: "ASC" | "DESC"): Promise<Link[]> {
        const subQuery = this.linkRepository
            .createQueryBuilder("link")
            .select("link.short", "short")
            .addSelect("COUNT(call.id)", "nrOfCalls")
            .leftJoin("call", "call", "call.linkId = link.id")
            .where("link.creatorId = '" + user.id + "'") // okay bcs it comes from jwt
            .groupBy("short");

        const res = await this.linkRepository
            .createQueryBuilder("link")
            .select("link.*, sub.nrOfCalls")
            .innerJoin("(" + subQuery.getQuery() + ")", "sub", "link.short = sub.short")
            .where("link.isActive = :isActive", {isActive: 1})
            .orderBy("sub.nrOfCalls", order)
            .getRawMany();

        return res;
    }

    private async getAllOrderByCallsVersion(user: User, order: "ASC" | "DESC") {
        const subQuery = this.linkRepository
            .createQueryBuilder("link")
            .select("link.short", "short")
            .addSelect("COUNT(call.id)", "nrOfCalls")
            .leftJoin("call", "call", "call.linkId = link.id")
            .where("link.creatorId = '" + user.id + "'") // okay bcs it comes from jwt
            .andWhere("link.isActive = " + 1)
            .groupBy("short");

        const res = await this.linkRepository
            .createQueryBuilder("link")
            .select("link.*, sub.nrOfCalls")
            .innerJoin("(" + subQuery.getQuery() + ")", "sub", "link.short = sub.short")
            .where("link.isActive = :isActive", {isActive: 1})
            .orderBy("sub.nrOfCalls", order)
            .getRawMany();

        return res;
    }
}
