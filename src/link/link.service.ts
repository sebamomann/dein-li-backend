import {Injectable} from '@nestjs/common';
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
            },
            order: {
                iat: "DESC"
            },
        });

        if (link === undefined) {
            throw new EntityNotFoundException(null, null, 'link');
        }

        return link;
    }

    public async get(short: string, user: User): Promise<Link> {
        const link = await this.getLinkByShort(short);

        return linkMapper.basic(link);
    }

    public async getHistoryStats(short: string, user: User) {
        const link = await this.getLinkByShort(short);

        const stats = this.callService.getStats(link);

        return stats;
    }

    public async getVersions(short: string, user: User) {
        let links = await this.linkRepository.find({where: {short, creator: user}, order: {iat: "DESC"}})

        links = links.map((mLink) => {
            return linkMapper.basic(mLink)
        });

        return links;
    }

    private async linkGenerationAndDuplicateCheck(short: string): Promise<string> {
        if (short) {
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
}
