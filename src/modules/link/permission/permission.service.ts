import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {User} from '../../../user/user.model';
import {InsufficientPermissionsException} from '../../../exceptions/InsufficientPermissionsException';
import {GeneratorUtil} from '../../../util/generator.util';
import {LinkPermission} from './link-permission.entity';
import {EntityNotFoundException} from '../../../exceptions/EntityNotFoundException';
import {IPermissionUpdateDTO} from './IPermissionUpdateDTO.interface';
import {LinkService} from '../link.service';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {IPermissionCreationDTO} from './IPermissionCreationDTO.interface';
import {PermissionMapper} from './permission.mapper';

@Injectable()
export class PermissionService {

	constructor(
		@Inject(forwardRef(() => LinkService))
		private linkService: LinkService,
		@InjectRepository(LinkPermission)
		private readonly linkPermissionRepo: Repository<LinkPermission>) {
	}

	public async createLinkPermission(permission: IPermissionCreationDTO, user: User) {
		const _link = await this.linkService.getLinkByShort(permission.link.short);

		if (_link.creatorId !== user.sub) {
			throw new InsufficientPermissionsException(null, null, null);
		}

		const token = GeneratorUtil.makeid(32);
		let _permission = new LinkPermission();
		_permission.link = _link;
		_permission.token = token;
		_permission.comment = permission.comment;
		_permission.expiration = permission.expiration;

		_permission = await this.linkPermissionRepo.save(_permission);

		const permissionMapper = new PermissionMapper();
		return permissionMapper.create(_permission);
	}

	public async getLinkPermissions(short: string, user: User) {
		const _link = await this.linkService.getLinkByShort(short);

		if (_link.creatorId !== user.sub) {
			throw new InsufficientPermissionsException(null, null, null);
		}

		const permissions = await this.linkPermissionRepo.createQueryBuilder('permission')
		                              .select('permission.*')
		                              .innerJoin('permission.link', 'link')
		                              .where('link.short = :short', {short: _link.short})
		                              .andWhere('link.creatorId <= :creatorId', {creatorId: user.sub})
		                              .execute();

		permissions.map((mPermission) => mPermission.link = {short: _link.short});

		const permissionMapper = new PermissionMapper();
		return permissionMapper.basicMultiple(permissions);
	}

	public async getLinkPermission(token: string, user: User) {
		const _permission = await this.getPermission(token);

		if (!_permission) {
			throw new EntityNotFoundException(null, null, 'permission');
		}

		if (_permission.link.creatorId !== user.sub) {
			throw new InsufficientPermissionsException(null, null, null);
		}

		const permissionMapper = new PermissionMapper();

		return permissionMapper.basic(_permission);
	}

	public async deleteLinkPermission(token: string, user: User) {
		const permission = await this.linkPermissionRepo.findOne({where: {token}});

		if (!permission) {
			throw new EntityNotFoundException(null, null, 'permission');
		}

		if (permission.link.creatorId !== user.sub) {
			throw new InsufficientPermissionsException(null, null, null);
		}

		await this.linkPermissionRepo.delete({token});

	}

	public async updateLinkPermission(token: string, permission: IPermissionUpdateDTO, user: User) {
		let _permission = await this.linkPermissionRepo.findOne({where: {token: token}});

		if (!_permission) {
			throw new EntityNotFoundException(null, null, 'permission');
		}

		if (_permission.link.creatorId !== user.sub) {
			throw new InsufficientPermissionsException(null, null, null);
		}

		if (permission.comment) {
			_permission.comment = permission.comment;
		}

		if (permission.expiration) {
			_permission.expiration = permission.expiration;
		}

		_permission = await this.linkPermissionRepo.save(_permission);

		return _permission;
	}

	public async permissionExists(token: string) {
		return await this.linkPermissionRepo.findOne({where: {token: token}}) !== undefined;
	}

	private async getPermission(token: string) {
		return await this.linkPermissionRepo.findOne({where: {token: token}});
	}
}
