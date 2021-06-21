import {forwardRef, HttpModule, Module} from '@nestjs/common';
import {PermissionController} from './permission.controller';
import {PermissionService} from './permission.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {LinkPermission} from './link-permission.entity';
import {LinkModule} from '../link.module';
import {AuthModule} from '../../../auth/auth.module';

@Module({
	imports: [TypeOrmModule.forFeature([LinkPermission]), forwardRef(() => LinkModule), AuthModule, HttpModule],
	controllers: [PermissionController],
	exports: [PermissionService],
	providers: [PermissionService],
})
export class PermissionModule {
}
