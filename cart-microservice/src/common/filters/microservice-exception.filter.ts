import {
    Catch,
    RpcExceptionFilter,
    ArgumentsHost,
    BadRequestException,
    InternalServerErrorException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';

@Catch()
export class MicroserviceExceptionFilter implements RpcExceptionFilter {
    catch(exception: any, host: ArgumentsHost): Observable<any> {
        if (exception instanceof BadRequestException) {
            // If it's a BadRequestException, return a formatted response for RPC
            return throwError(() => ({
                status: 'error',
                message: exception.message,
                statusCode: 400,
            }));
        }
        // For all other exceptions, return a generic error
        return throwError(() => ({
            status: 'error',
            message: 'Internal server error',
            statusCode: 500,
        }));
    }
}
