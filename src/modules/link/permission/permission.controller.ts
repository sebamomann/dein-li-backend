import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Param,
	Post,
	Put,
	Query,
	Res,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import {AuthGuard} from '../../../auth/auth.gurad';
import {Usr} from '../../../user/user.decorator';
import {User} from '../../../user/user.model';
import {Response} from 'express';
import {IPermissionUpdateDTO} from './IPermissionUpdateDTO.interface';
import {PermissionService} from './permission.service';
import {BusinessToHttpExceptionInterceptor} from '../../../interceptor/BusinessToHttpException.interceptor';
import {IPermissionCreationDTO} from './IPermissionCreationDTO.interface';
import {EntityNotFoundException} from '../../../exceptions/EntityNotFoundException';
import {InsufficientPermissionsException} from '../../../exceptions/InsufficientPermissionsException';

@Controller('permissions')
@UseInterceptors(BusinessToHttpExceptionInterceptor)
export class PermissionController {

	constructor(private permissionService: PermissionService) {
	}

	@Get() // TODO SWAGGER ...
	@UseGuards(AuthGuard)
	getLinkPermissions(@Usr() user: User,
	                   @Query('link') short: string,
	                   @Res() res: Response) {
		return this.permissionService
		           .getLinkPermissions(short, user)
		           .then(
			           tLink => {
				           res.status(HttpStatus.OK).json(tLink);
			           },
		           )
		           .catch(
			           (err) => {
				           if (err instanceof InsufficientPermissionsException) {
					           throw new InsufficientPermissionsException(null, null, [{
						           'attribute': 'link',
						           'in': 'query',
						           'value': short,
						           'message': 'Specified link is not in your ownership',
					           }]);
				           } else if (err instanceof EntityNotFoundException) {
					           if (err.data === 'link') {
						           throw new EntityNotFoundException(null, null, {
							           'attribute': 'link',
							           'in': 'query',
							           'value': short,
						           });
					           }
				           }

				           throw err;
			           },
		           );
	}

	@Get(':token') // TODO SWAGGER ...
	@UseGuards(AuthGuard)
	getLinkPermission(@Usr() user: User,
	                  @Param('token') token: string,
	                  @Res() res: Response) {
		return this.permissionService
		           .getLinkPermission(token, user)
		           .then(
			           tLink => {
				           res.status(HttpStatus.OK).json(tLink);
			           },
		           )
		           .catch(
			           (err) => {
				           if (err instanceof EntityNotFoundException) {
					           throw new EntityNotFoundException(null, null, {
						           'attribute': 'token',
						           'in': 'path',
						           'value': token,
					           });
				           } else if (err instanceof InsufficientPermissionsException) {
					           throw new InsufficientPermissionsException(null, null, [{
						           'attribute': 'token',
						           'value': token,
						           'in': 'path',
						           'message': 'Specified permission is not associated with one of your links',
					           }]);
				           }

				           throw err;
			           },
		           );
	}

	@Post() // TODO SWAGGER ...
	@UseGuards(AuthGuard)
	createLinkPermission(@Usr() user: User,
	                     @Body() permission: IPermissionCreationDTO,
	                     @Res() res: Response) {
		return this.permissionService
		           .createLinkPermission(permission, user)
		           .then(
			           tPermission => {
				           res.header('Location', `${process.env.API_URL}permissions/${tPermission.token}`);
				           res.status(HttpStatus.CREATED).json(tPermission);
			           },
		           )
		           .catch(
			           (err) => {
				           if (err instanceof EntityNotFoundException) {
					           if (err.data === 'link') {
						           throw new EntityNotFoundException(null, null, {
							           'object': 'link',
							           'attribute': 'short',
							           'in': 'body',
							           'value': permission.link.short,
						           });
					           }
				           } else if (err instanceof InsufficientPermissionsException) {
					           throw new InsufficientPermissionsException(null, null, [{
						           'object': 'link',
						           'attribute': 'short',
						           'in': 'body',
						           'value': permission.link.short,
						           'message': 'Specified link is not in your ownership',
					           }]);
				           }

				           throw err;
			           },
		           );
	}

	@Delete(':permission') // TODO SWAGGER ...
	@UseGuards(AuthGuard)
	deleteLinkPermission(@Usr() user: User,
	                     @Param('permission') token: string,
	                     @Res() res: Response) {
		return this.permissionService
		           .deleteLinkPermission(token, user)
		           .then(
			           () => {
				           res.status(HttpStatus.NO_CONTENT).json();
			           },
		           )
		           .catch(
			           (err) => {
				           if (err instanceof EntityNotFoundException) {
					           throw new EntityNotFoundException(null, null, {
						           'attribute': 'token',
						           'in': 'path',
						           'value': token,
					           });
				           } else if (err instanceof InsufficientPermissionsException) {
					           throw new InsufficientPermissionsException(null, null, [{
						           'attribute': 'token',
						           'value': token,
						           'in': 'path',
						           'message': 'Specified permission is not associated with one of your links',
					           }]);
				           }

				           throw err;
			           },
		           );
	}

	@Put(':permission') // TODO SWAGGER ...
	@UseGuards(AuthGuard)
	updateLinkPermission(@Usr() user: User,
	                     @Param('permission') token: string,
	                     @Body() permission: IPermissionUpdateDTO,
	                     @Res() res: Response) {
		return this.permissionService
		           .updateLinkPermission(token, permission, user)
		           .then(
			           tLink => {
				           res.status(HttpStatus.NO_CONTENT).json(tLink);
			           },
		           )
		           .catch(
			           (err) => {
				           if (err instanceof EntityNotFoundException) {
					           throw new EntityNotFoundException(null, null, {
						           'attribute': 'token',
						           'in': 'path',
						           'value': token,
					           });
				           } else if (err instanceof InsufficientPermissionsException) {
					           throw new InsufficientPermissionsException(null, null, [{
						           'attribute': 'token',
						           'value': token,
						           'in': 'path',
						           'message': 'Specified permission is not associated with one of your links',
					           }]);
				           }

				           throw err;
			           },
		           );
	}

}
