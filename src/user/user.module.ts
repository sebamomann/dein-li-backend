import {Module} from '@nestjs/common';
import {User} from './user.entity';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserController} from './user.controller';
import {UserService} from './user.service';
import {AuthModule} from '../auth/auth.module';
import {Session} from './session.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Session]), AuthModule],
    providers: [UserService],
    exports: [UserService],
    controllers: [UserController],
})
export class UserModule {
}
