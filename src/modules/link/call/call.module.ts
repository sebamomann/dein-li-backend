import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Call} from "./call.entity";
import {CallService} from "./call.service";

@Module({
    imports: [TypeOrmModule.forFeature([Call])],
    providers: [CallService],
    exports: [CallService],
})
export class CallModule {
}
