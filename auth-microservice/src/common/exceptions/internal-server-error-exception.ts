import { HttpException, HttpStatus } from '@nestjs/common';

export class InternalServerErrorException extends HttpException {
    constructor(message?: string, error?: string) {
        super(
            {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: message || 'Internal server error occurred',
                error: error || 'Internal Server Error',
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
}
