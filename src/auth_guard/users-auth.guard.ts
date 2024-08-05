import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { env } from 'process';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';

@Injectable()
export class UsersAuthGuard implements CanActivate {
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
            
            if (!token) {
                return false;
            }
            
            if(token && jwt.verify(token, env['SECRET_KEY'])) {
                const data = jwt.decode(token);
                return data['id'] === request.params.userId;
            }
        } catch (e) {
            throw new UnauthorizedException('Invalid Token');
        }
        
        return false;
    }
}
