import {Injectable} from '@nestjs/common';
import {Link} from "./link.entity";
import {User} from "../user/user.entity";

import validUrl from "valid-url";
import {InvalidAttributesException} from "../exceptions/InvalidAttributesException";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";

import randomstring from "randomstring";
import {AlreadyUsedException} from "../exceptions/AlreadyUsedException";
import {EntityNotFoundException} from "../exceptions/EntityNotFoundException";
import {InsufficientPermissionsException} from "../exceptions/InsufficientPermissionsException";

@Injectable()
export class LinkService {
    constructor(
        @InjectRepository(Link)
        private readonly linkRepository: Repository<Link>,
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

        linkToDb = await this.linkRepository.save(linkToDb);

        linkToDb.short = await this.linkGenerationAndDuplicateCheck(link.short);

        return linkToDb;
    }

    public async newVersion(link: Link, user: User): Promise<Link> {
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

        const existingVersion = await this.isAllowedToGenerateNewVersion(link, user)

        linkToDb.short = existingVersion.short;
        linkToDb.creator = existingVersion.creator;
        linkToDb.original = link.original;

        linkToDb = await this.linkRepository.save(linkToDb);

        return linkToDb;
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

        return link === undefined;
    }

    private async isAllowedToGenerateNewVersion(link: Link, user: User) {
        const _link = await this.getLinkByShort(link.short);

        if (_link.creator.username !== user.username) {
            throw new InsufficientPermissionsException(null,
                "Missing permissions to generate new version for specified Link", [
                    {
                        "attribute": "short",
                        "value": link.short
                    }
                ]);
        }

        return _link;
    }

    private async getLinkByShort(short: string) {
        const link = await this.linkRepository.findOne({
            where: {
                short,
            }
        });

        if (link === undefined) {
            throw new EntityNotFoundException(null, null, 'link');
        }

        return link;
    }
}
