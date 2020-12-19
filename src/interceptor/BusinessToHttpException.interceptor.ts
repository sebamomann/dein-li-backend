import {
    BadRequestException,
    CallHandler,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NestInterceptor,
    NotFoundException,
    UnprocessableEntityException
} from '@nestjs/common';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {GeneratorUtil} from '../util/generator.util';
import {InsufficientPermissionsException} from '../exceptions/InsufficientPermissionsException';
import {EntityNotFoundException} from '../exceptions/EntityNotFoundException';
import {AlreadyUsedException} from '../exceptions/AlreadyUsedException';
import {InvalidAttributesException} from '../exceptions/InvalidAttributesException';

@Injectable()
export class BusinessToHttpExceptionInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle()
            .pipe(
                catchError(
                    exception => {
                        if (exception instanceof EntityNotFoundException) {
                            throw new NotFoundException(exception.parse());
                        } else if (exception instanceof AlreadyUsedException) {
                            throw new BadRequestException(exception.parse());
                        } else if (exception instanceof InsufficientPermissionsException) {
                            throw new ForbiddenException(exception.parse());
                        } else if (exception instanceof InvalidAttributesException) {
                            throw new UnprocessableEntityException(exception.parse());
                        } else {
                            const id = GeneratorUtil.makeid(10);
                            console.log(`[${(new Date()).toDateString()} ${(new Date()).toTimeString()}] Code: ${id} - ${JSON.stringify(exception)}`);

                            const error: any = {};

                            error.code = 'UNDEFINED';
                            error.message = 'Some error occurred. Please try again later or contact the support with the appended error Code';
                            error.data = id;

                            throw new InternalServerErrorException(error);
                        }
                    }
                )
            );
    }
}
