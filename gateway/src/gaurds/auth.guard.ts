import { RequestModel } from '@/middleware/auth.middleware';
import { User } from '@/users/entities/user.entity';
import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(

        @Inject('NATS_SERVICE') private natsClient: ClientProxy
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<RequestModel>();
        const authHeader = request.headers['authorization'];
        if (!authHeader) {
            throw new HttpException('Authorization header missing', HttpStatus.UNAUTHORIZED);
        }
        const tokenArray: string[] = authHeader.split(' ');
        if (tokenArray.length !== 2) {
            throw new HttpException('Invalid authorization format', HttpStatus.UNAUTHORIZED);
        }

        const token = tokenArray[1];
        try {
            // const decodedToken = await this.authService.validateToken(token);
            const user = await lastValueFrom<User>(
                this.natsClient.send({ cmd: 'validate-authToken' }, token)
            );
            // const user = await this.userService.findOne(decodedToken.sub.id);
            if (!user) {
                throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
            }

            request.user = user;
            return true;
        } catch (error) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
    }
}