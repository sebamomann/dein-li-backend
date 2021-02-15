import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from "@nestjs/common";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";


@Injectable()
export class ValidAuthHeaderInterceptor<T> implements NestInterceptor<T, any> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle()
            .pipe(
                map(data => {
                    const res = context.switchToHttp().getResponse();
                    res.header("test", "tesdt ");
                    return data;
                })
            );
    }
}
