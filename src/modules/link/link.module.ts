import {HttpModule, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Link} from './link.entity';
import {LinkService} from './link.service';
import {LinkController} from './link.controller';
import {UserModule} from '../../user/user.module';
import {CallModule} from './call/call.module';
import {AuthModule} from '../../auth/auth.module';
import {PermissionModule} from './permission/permission.module';

@Module({
	imports: [TypeOrmModule.forFeature([Link]), PermissionModule, UserModule, CallModule, AuthModule, HttpModule],
	providers: [LinkService],
	exports: [LinkService],
	controllers: [LinkController],
})
export class LinkModule {
}
