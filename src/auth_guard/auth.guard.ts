import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { env } from 'process';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    validateRequest (request: Request): boolean {
        try {
            if (!request.headers['authorization']) {
                return false;
            }
            const token = request.headers['authorization'].split(' ')[1];

            if(jwt.verify(token, env['SECRET_KEY'])) {
                const data = jwt.decode(token);
                if (data['id'] === request.params.id) {
                    return true
                }
                return false;
            }
        } catch (e) {
            throw new UnauthorizedException();
        }
        
        return false;
    }
}