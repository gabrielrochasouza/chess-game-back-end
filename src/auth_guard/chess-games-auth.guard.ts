import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { env } from 'process';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';

@Injectable()
export class ChessGamesAuthGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    validateRequest (request: Request): boolean {
        try {
            if (!request.headers['authorization'] || !request.headers['authorization'].split(' ')[1]) {
                return false;
            }
            const token = request.headers['authorization'].split(' ')[1];

            if(jwt.verify(token, env['SECRET_KEY'])) {
                return true;
            }
        } catch (e) {
            throw new UnauthorizedException('Invalid Token');
        }
        
        return false;
    }
}