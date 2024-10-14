import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { User } from 'src/users/entities/user.entity';

export interface RequestModel extends Request {
    user: User
}


@Injectable()
export class AuthMiddleware {
    constructor() { }
    // constructor(private authService: AuthService, private userService: UsersService) { }

    // async use(req: RequestModel, res: Response, next: NextFunction) {
    //     try {
    //         const tokenArray: string[] = req.headers['authorization'].split(' ');
    //         console.log('stage 1', tokenArray[1])
    //         const decodedToken = await this.authService.validateToken(tokenArray[1]);
    //         console.log('stage 2', decodedToken)
    //         const user: User = await this.userService.findOne(decodedToken.user.id);
    //         console.log('stage 3', user)
    //         if (user) {
    //             req.user = user;
    //             next();
    //         } else {
    //             throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    //         }
    //     } catch {
    //         throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    //     }
    // }
}