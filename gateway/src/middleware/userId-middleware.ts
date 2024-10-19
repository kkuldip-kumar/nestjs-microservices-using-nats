import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class UserIdMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        // if (req.user && req.user['sub']) {
        //     req['userId'] = req.user['sub'].user; // Attach userId to the request object
        // }
        next();
    }
}
