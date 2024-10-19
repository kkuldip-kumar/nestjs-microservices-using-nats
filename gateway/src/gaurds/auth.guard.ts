import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus, Inject, InternalServerErrorException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, lastValueFrom, retry } from 'rxjs';
import { RequestModel } from '@/middleware/auth.middleware';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @Inject('NATS_SERVICE') private natsClient: ClientProxy
    ) { }

    async checkJWTToken(token: string) {
        try {
            // Sending token to the NATS microservice for validation
            const user = await lastValueFrom(
                this.natsClient.send({ cmd: 'validate-authToken' }, token).pipe(
                    retry(3),  // Retry 3 times on failure
                    catchError((error) => {
                        console.error('Microservice failed after retries:', error);
                        throw new InternalServerErrorException('Microservice is unavailable');
                    }),
                ),
            );
            return user;
        } catch (error) {
            console.error('Error from NATS microservice:', error);

            // Handle specific error response from the microservice
            if (error && error.status === 'error') {
                throw new BadRequestException(error.message || 'Token validation failed');
            }

            // General error if no specific message or status is available
            throw new InternalServerErrorException('Failed to communicate with microservice');
        }
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<RequestModel>();
        const authHeader = request.headers['authorization'];

        // Check if authorization header exists
        if (!authHeader) {
            throw new UnauthorizedException('Authorization header is missing');
        }

        const tokenArray: string[] = authHeader.split(' ');
        if (tokenArray.length !== 2 || tokenArray[0] !== 'Bearer') {
            throw new UnauthorizedException('Invalid authorization format');
        }

        const token = tokenArray[1];

        try {
            // Validate JWT token by sending it to the microservice
            const user = await this.checkJWTToken(token);

            if (!user) {
                throw new UnauthorizedException('Invalid token or user not found');
            }

            // Attach the user object to the request
            request.user = user;
            return true;
        } catch (error) {
            // If the token validation fails, throw Unauthorized
            throw new UnauthorizedException('Unauthorized access');
        }
    }
}
