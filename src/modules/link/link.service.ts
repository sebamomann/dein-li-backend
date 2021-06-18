import {Injectable, UnauthorizedException} from '@nestjs/common';
import {Link} from './link.entity';
import {User} from '../../user/user.model';
import {InvalidAttributesException} from '../../exceptions/InvalidAttributesException';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';

import {AlreadyUsedException} from '../../exceptions/AlreadyUsedException';
import {EntityNotFoundException} from '../../exceptions/EntityNotFoundException';
import {InsufficientPermissionsException} from '../../exceptions/InsufficientPermissionsException';
import {CallService} from './call/call.service';
import {ForbiddenAttributesException} from '../../exceptions/ForbiddenAttributesException';
import {GeneratorUtil} from '../../util/generator.util';
import {LinkPermission} from './link-permission.entity';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const validUrl = require('valid-url');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const linkMapper = require('./link.mapper');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const randomstring = require('randomstring');

@Injectable()
export class LinkService {
	constructor(
		@InjectRepository(Link)
		private readonly linkRepository: Repository<Link>,
		@InjectRepository(LinkPermission)
		private readonly linkPermissionRepo: Repository<LinkPermission>,
		private callService: CallService,
	) {
	}

	private static generateLink(): string {
		return randomstring.generate(7);
	}

	public async create(link: Link, user: User): Promise<Link> {
		let linkToDb = new Link();

		if (!validUrl.isUri(link.original)) {
			throw new InvalidAttributesException(null,
				null, [
					{
						'attribute': 'original',
						'value': link.original,
						'message': 'Invalid URL format',
					},
				]);
		}

		if (!user) {
			if (link.short) {
				throw new ForbiddenAttributesException(null, null, ['short']);
			}

			linkToDb.creatorId = null;
		} else {
			linkToDb.creatorId = user.sub;
		}

		linkToDb.original = link.original;
		linkToDb.short = await this.linkGenerationAndDuplicateCheck(link.short);

		linkToDb = await this.linkRepository.save(linkToDb);

		return linkMapper.creation(linkToDb);
	}

	public async newVersion(link: Link, short: string, user: User, token: string): Promise<Link> {
		let linkToDb = new Link();

		if (!validUrl.isUri(link.original)) {
			throw new InvalidAttributesException(null,
				null, [
					{
						'attribute': 'original',
						'value': link.original,
						'message': 'Invalid URL format',
					},
				]);
		}

		const existingVersion = await this.isAllowedToGenerateNewVersion(short, user, token);
		existingVersion.isActive = -1;
		this.linkRepository.save(existingVersion).then();

		linkToDb.short = existingVersion.short;
		linkToDb.creatorId = existingVersion.creatorId;
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
				iat: 'DESC',
			},
		});

		if (link === undefined) {
			throw new EntityNotFoundException(null, null, {
				attribute: 'short',
				in: 'path',
				value: short,
			});
		}

		return link;
	}

	public async getLinkByShortAndReports(short: string) {
		const link = await this.linkRepository.findOne({
			where: {
				short,
				isActive: 1,
			},
			relations: ['reports'],
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

	public async getStats(short: string, user: User, interval: 'minutes' | 'hours' | 'days' | 'months', start: string, end: string) {
		if (!interval) {
			interval = 'hours';
		}

		return await this.getLinkStatsByShort(short, user, interval, start, end);
	}

	public async getStatsAll(user: User, interval: 'minutes' | 'hours' | 'days' | 'months', start: string, end: string) {
		if (!interval) {
			interval = 'hours';
		}

		return await this.getLinkStatsTotal(interval, start, end);
	}


	// TODO
	// 403 forbidden

	public async getVersions(short: string, user: User, token: string) {
		let links = await this.linkRepository.find({where: {short, creatorId: user.sub}, order: {iat: 'DESC'}});

		if (links.length <= 0) {
			throw new EntityNotFoundException(null, null, {
				attribute: 'short',
				in: 'path',
				value: short,
			});
		}

		links = links.map((mLink) => {
			return linkMapper.basic(mLink);
		});

		return links;
	}

	public async getAll(user: User, sort: string, limit: number, offset: number) {
		let val: Link[];
		if (!sort) {
			val = await this.getAllOrderByIat(user, 'DESC', limit, offset);
		} else {
			let orderDirection;
			let sortParameter;

			if (!sort.startsWith('-') && !sort.startsWith(' ')) { // + gets replaced by space
				orderDirection = '-';
				sortParameter = sort;
			} else {
				// TODO ENUM?
				orderDirection = sort.slice(0, 1);
				orderDirection = orderDirection === '-' ? 'DESC' : 'ASC';
				sortParameter = sort.slice(1);
			}

			switch (sortParameter) {
				case 'calls':
					val = await this.getAllOrderByCalls(user, orderDirection, limit, offset);
					break;
				case 'iat':
					val = await this.getAllOrderByIat(user, orderDirection, limit, offset);
					break;
				case 'calls_version':
					val = await this.getAllOrderByCallsVersion(user, orderDirection, limit, offset);
					break;
				default:
					val = await this.getAllOrderByIat(user, orderDirection, limit, offset);
			}
		}

		val = val.map((mVal) => linkMapper.basic(mVal));

		return val;
	}

	public async createLinkPermission(short: string, user: User) {
		const _link = await this.getLinkByShort(short);

		if (_link.creatorId !== user.sub) {
			throw new InsufficientPermissionsException(null,
				null, [
					{
						'attribute': 'short',
						'value': short,
						'message': 'Specified link is not in your ownership',
					},
				]);
		}

		const token = GeneratorUtil.makeid(32);
		let permission = new LinkPermission();
		permission.link = _link;
		permission.token = token;

		permission = await this.linkPermissionRepo.save(permission);

		return permission;
	}

	public async getLinkPermission(short: string, user: User) {
		const _link = await this.getLinkByShort(short);

		if (_link.creatorId !== user.sub) {
			throw new InsufficientPermissionsException(null,
				null, [
					{
						'attribute': 'short',
						'value': short,
						'message': 'Specified link is not in your ownership',
					},
				]);
		}

		return await this.linkPermissionRepo.createQueryBuilder('permission')
		                 .select('permission.*')
		                 .innerJoin('permission.link', 'link')
		                 .where('link.short = :short', {short: _link.short})
		                 .andWhere('link.creatorId <= :creatorId', {creatorId: user.sub})
		                 .execute();
	}

	public async deleteLinkPermission(short: string, token: string, user: User) {
		const _link = await this.getLinkByShort(short);

		if (_link.creatorId !== user.sub) {
			throw new InsufficientPermissionsException(null,
				null, [
					{
						'attribute': 'short',
						'value': short,
						'message': 'Specified link is not in your ownership',
					},
				]);
		}

		const affected = (await this.linkPermissionRepo.delete({token})).affected;

		if (affected === 0) {
			throw new EntityNotFoundException(null, null, 'permission');
		}

	}

	private async getLinkStatsByShort(short: string, user: User, interval: 'minutes' | 'hours' | 'days' | 'months', start: string, end: string) {
		const link = await this.getLinkByShort(short);

		if (link.creatorId !== user.sub) {
			throw new UnauthorizedException();
		} else {
			return await this.callService.getStats(link, interval, start, end);
		}
	}

	private async getLinkStatsTotal(interval: 'minutes' | 'hours' | 'days' | 'months', start: string, end: string) {
		return await this.callService.getStatsTotal(interval, start, end);
	}

	private async linkGenerationAndDuplicateCheck(short: string): Promise<string> {
		if (short) {
			if (!short.match(new RegExp('^[a-zA-Z0-9\-\_]*$'))) {
				throw new InvalidAttributesException(null,
					null, [{
						'attribute': 'short',
						'value': short,
						'message': 'Invalid format. The required format is \'^[a-zA-Z0-9\-\_]*$\'',
					}]);
			}

			if (await this.linkInUse(short)) {
				throw new AlreadyUsedException('DUPLICATE_VALUES',
					'Provided values are already in use', [{
						'attribute': 'short',
						'value': short,
						'message': 'Value is already in use by other user. Specify a new one',
					}]);
			}
		} else {
			do {
				short = LinkService.generateLink();
			} while (await this.linkInUse(short));
		}


		return short;
	}

	private async linkInUse(short: string) {
		const link = await this.linkRepository.findOne({
			where: {
				short,
			},
		});

		return link !== undefined;
	}

	private async isAllowedToGenerateNewVersion(short: string, user: User, token: string) {
		const _link = await this.getLinkByShort(short);

		if (_link.creatorId !== user.sub) {
			if (!await this.permissionExists(token)) {
				throw new InsufficientPermissionsException(null,
					null, [
						{
							'attribute': 'short',
							'value': short,
							'message': 'Specified link is not in your ownership',
						},
					]);
			}
		}

		return _link;
	}

	private async getAllOrderByIat(user: User, order: 'ASC' | 'DESC', limit: number, offset: number) {
		const subQuery = this.linkRepository
		                     .createQueryBuilder('link')
		                     .select('link.short', 'short')
		                     .addSelect('COUNT(call.id)', 'nrOfCalls')
		                     .leftJoin('call', 'call', 'call.linkId = link.id')
		                     .where('link.creatorId = \'' + user.sub + '\'') // okay bcs it comes from jwt
		                     .orderBy('link.iat', order)
		                     .groupBy('short')
		                     .limit(limit ? limit : null)
		                     .offset(offset ? offset : 0);

		const res = await this.linkRepository
		                      .createQueryBuilder('link')
		                      .select('link.*, CONVERT(sub.nrOfCalls, UNSIGNED INTEGER) as nrOfCalls')
		                      .innerJoin('(' + subQuery.getQuery() + ')', 'sub', 'link.short = sub.short')
		                      .where('link.isActive = :isActive', {isActive: 1})
		                      .orderBy('link.iat', order)
		                      .getRawMany();

		return res;

		// return await this.linkRepository
		//     .createQueryBuilder("link")
		//     .select('*')
		//     .where("creatorId = :userId", {
		//         userId: user.sub
		//     })
		//     .orderBy({iat: order})
		//     .groupBy("short")
		//     .limit(limit ? limit : null)
		//     .offset(offset ? offset : 0)
		//     .getRawMany();
	}

	private async getAllOrderByCalls(user: User, order: 'ASC' | 'DESC', limit: number, offset: number): Promise<Link[]> {
		const subQuery = this.linkRepository
		                     .createQueryBuilder('link')
		                     .select('link.short', 'short')
		                     .addSelect('COUNT(call.id)', 'nrOfCalls')
		                     .leftJoin('call', 'call', 'call.linkId = link.id')
		                     .where('link.creatorId = \'' + user.sub + '\'') // okay bcs it comes from jwt
		                     .orderBy('nrOfCalls', order)
		                     .addOrderBy('link.iat', 'DESC')
		                     .groupBy('short')
		                     .limit(limit ? limit : null)
		                     .offset(offset ? offset : 0);

		const res = await this.linkRepository
		                      .createQueryBuilder('link')
		                      .select('link.*, CONVERT(sub.nrOfCalls, UNSIGNED INTEGER) as nrOfCalls')
		                      .innerJoin('(' + subQuery.getQuery() + ')', 'sub', 'link.short = sub.short')
		                      .where('link.isActive = :isActive', {isActive: 1})
		                      .orderBy('sub.nrOfCalls', order)
		                      .getRawMany();

		return res;
	}

	private async getAllOrderByCallsVersion(user: User, order: 'ASC' | 'DESC', limit: number, offset: number) {
		const subQuery = this.linkRepository
		                     .createQueryBuilder('link')
		                     .select('link.short', 'short')
		                     .addSelect('COUNT(call.id)', 'nrOfCalls')
		                     .leftJoin('call', 'call', 'call.linkId = link.id')
		                     .where('link.creatorId = \'' + user.sub + '\'') // okay bcs it comes from jwt
		                     .andWhere('link.isActive = ' + 1)
		                     .groupBy('short')
		                     .limit(limit ? limit : null)
		                     .offset(offset ? offset : 0);

		return await this.linkRepository
		                 .createQueryBuilder('link')
		                 .select('link.*, sub.nrOfCalls')
		                 .innerJoin('(' + subQuery.getQuery() + ')', 'sub', 'link.short = sub.short')
		                 .where('link.isActive = :isActive', {isActive: 1})
		                 .orderBy('sub.nrOfCalls', order)
		                 .addOrderBy('link.iat', 'DESC')
		                 .getRawMany();
	}

	private async permissionExists(token: string) {
		return await this.linkPermissionRepo.findOne({where: {token: token}}) !== undefined;
	}
}
