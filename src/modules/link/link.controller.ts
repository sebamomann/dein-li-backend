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
	getLinkByShort(@Usr() user: User,
	               @Param('short') short: string,
	               @Res() res: Response) {
		return this.linkService
		           .get(short)
		           .then(tLink => {
			           res.status(HttpStatus.OK).json(tLink);
		           })
		           .catch((err) => {
			           throw err;
		           });
	}

	@Put(':short')
	@UseGuards(AuthGuard)
	newVersion(@Usr() user: User,
	           @Headers('x-link-permission') token: string,
	           @Param('short') short: string,
	           @Body() link: Link,
	           @Res() res: Response) {
		return this.linkService
		           .newVersion(link, short, user, token)
		           .then(() => {
			           res.status(HttpStatus.NO_CONTENT).send();
		           })
		           .catch((err) => {
			           throw err;
		           });
	}

	@Get(':short/versions')
	@UseGuards(AuthGuard)
	getVersions(@Usr() user: User,
	            @Headers('x-link-permission') token: string,
	            @Param('short') short: string,
	            @Res() res: Response) {
		return this.linkService
		           .getVersions(short, user, token)
		           .then(tLink => {
			           res.status(HttpStatus.OK).json(tLink);
		           })
		           .catch((err) => {
			           throw err;
		           });
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
		           .catch((err) => {
			           throw err;
		           });
	}

	@Get(':short/permissions') // TODO SWAGGER ...
	@UseGuards(AuthGuard)
	getLinkPermission(@Usr() user: User,
	                  @Param('short') short: string,
	                  @Res() res: Response) {
		return this.linkService
		           .getLinkPermission(short, user)
		           .then(tLink => {
			           res.status(HttpStatus.OK).json(tLink);
		           })
		           .catch((err) => {
			           throw err;
		           });
	}

	@Post(':short/permissions') // TODO SWAGGER ...
	@UseGuards(AuthGuard)
	createLinkPermission(@Usr() user: User,
	                     @Param('short') short: string,
	                     @Res() res: Response) {
		return this.linkService
		           .createLinkPermission(short, user)
		           .then(tLink => {
			           res.status(HttpStatus.OK).json(tLink);
		           })
		           .catch((err) => {
			           throw err;
		           });
	}
}
