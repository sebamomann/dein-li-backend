import {
	Body,
	Controller,
	Get,
	Headers,
	HttpStatus,
	Param,
	Post,
	Put,
	Query,
	Res,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';

import {Usr} from '../../user/user.decorator';
import {User} from '../../user/user.model';

import {Link} from './link.entity';
import {LinkService} from './link.service';

import {Response} from 'express';
import {BusinessToHttpExceptionInterceptor} from '../../interceptor/BusinessToHttpException.interceptor';
import {AuthGuard} from '../../auth/auth.gurad';
import {AuthOptGuard} from '../../auth/auth-opt.gurad';
import {EntityNotFoundException} from '../../exceptions/EntityNotFoundException';
import {InsufficientPermissionsException} from '../../exceptions/InsufficientPermissionsException';

@Controller('links')
@UseInterceptors(BusinessToHttpExceptionInterceptor)
export class LinkController {

	constructor(private linkService: LinkService) {
	}

	@Get()
	@UseGuards(AuthGuard)
	getAll(@Usr() user: User,
	       @Query('sort') sort: string,
	       @Query('limit') limit: number,
	       @Query('offset') offset: number,
	       @Res() res: Response) {
		return this.linkService
		           .getAll(user, sort, limit, offset)
		           .then(tLink => {
			           res.status(HttpStatus.OK).json(tLink);
		           })
		           .catch((err) => {
			           throw err;
		           });
	}

	@Post()
	@UseGuards(AuthOptGuard)
	create(@Usr() user: User,
	       @Body() link: Link,
	       @Res() res: Response) {
		return this.linkService
		           .create(link, user)
		           .then(tLink => {
			           res.header('Location', `${process.env.API_URL}links/${tLink.short}`);
			           res.status(HttpStatus.CREATED).json(tLink);
		           })
		           .catch((err) => {
			           throw err;
		           });
	}

	@Get(':short')
	@UseGuards(AuthOptGuard)
	getLinkByShort(@Param('short') short: string,
	               @Res() res: Response) {
		return this.linkService
		           .get(short)
		           .then(tLink => {
			           res.status(HttpStatus.OK).json(tLink);
		           })
		           .catch((err) => {
			           if (err instanceof EntityNotFoundException) {
				           if (err.data === 'link') {
					           throw new EntityNotFoundException(null, null, {
						           'attribute': 'short',
						           'in': 'path',
						           'value': short,
					           });
				           }
			           }

			           throw err;
		           });
	}

	@Put(':short')
	@UseGuards(AuthOptGuard)
	newVersion(@Usr() user: User,
	           @Headers('x-link-permission') token: string,
	           @Param('short') short: string,
	           @Body() link: Link,
	           @Res() res: Response) {
		return this.linkService
		           .newVersion(link, short, user, token)
		           .then(
			           () => {
				           res.status(HttpStatus.NO_CONTENT).send();
			           },
		           )
		           .catch(
			           (err) => {
				           if (err instanceof EntityNotFoundException) {
					           if (err.data === 'link') {
						           throw new EntityNotFoundException(null, null, {
							           'attribute': 'short',
							           'in': 'path',
							           'value': short,
						           });
					           }
				           } else if (err instanceof InsufficientPermissionsException) {
					           const errorObjects = [];

					           if (err.data.includes('user')) {
						           errorObjects.push({
							           'in': 'path',
							           'attribute': 'short',
							           'value': short,
							           'message': 'Specified link is not in your ownership',
						           });
					           }

					           if (err.data.includes('token')) {
						           errorObjects.push({
							           'in': 'header',
							           'attribute': 'x-link-permission',
							           'value': token,
							           'message': 'Specified token provides no permission for the requested link',
						           });
					           }

					           throw new InsufficientPermissionsException(null, null, errorObjects);
				           }

				           throw err;
			           },
		           );
	}

	@Get(':short/versions')
	@UseGuards(AuthOptGuard)
	getVersions(@Usr() user: User,
	            @Headers('x-link-permission') token: string,
	            @Param('short') short: string,
	            @Res() res: Response) {
		return this.linkService
		           .getVersions(short, user, token)
		           .then(
			           tLink => {
				           res.status(HttpStatus.OK).json(tLink);
			           })
		           .catch(
			           (err) => {
				           console.log(err);
			           	
				           if (err instanceof EntityNotFoundException) {
					           if (err.data === 'link') {
						           throw new EntityNotFoundException(null, null, {
							           'attribute': 'short',
							           'in': 'path',
							           'value': short,
						           });
					           }
				           } else if (err instanceof InsufficientPermissionsException) {
					           const errorObjects = [];

					           if (err.data.includes('user')) {
						           errorObjects.push({
							           'in': 'path',
							           'attribute': 'short',
							           'value': short,
							           'message': 'Specified link is not in your ownership',
						           });
					           }

					           if (err.data.includes('token')) {
						           errorObjects.push({
							           'in': 'header',
							           'attribute': 'x-link-permission',
							           'value': token,
							           'message': 'Specified token provides no permission for the requested link',
						           });
					           }

					           throw new InsufficientPermissionsException(null, null, errorObjects);
				           }

				           throw err;
			           },
		           );
	}

	@Get(':short/statistics')
	@UseGuards(AuthGuard)
	getHistoryStats(@Usr() user: User,
	                @Param('short') short: string,
	                @Query('start') start: string,
	                @Query('end') end: string,
	                @Query('interval') interval: 'minutes' | 'hours' | 'days' | 'months',
	                @Res() res: Response) {
		return this.linkService
		           .getStats(short, user, interval, start, end)
		           .then(tLink => {
			           res.status(HttpStatus.OK).json(tLink);
		           })
		           .catch(
			           (err) => {
				           if (err instanceof EntityNotFoundException) {
					           if (err.data === 'link') {
						           throw new EntityNotFoundException(null, null, {
							           'attribute': 'short',
							           'in': 'path',
							           'value': short,
						           });
					           }
				           }

				           throw err;
			           },
		           );
	}
}
