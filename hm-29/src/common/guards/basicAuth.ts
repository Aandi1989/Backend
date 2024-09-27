import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { UsersQueryRepo } from 'src/features/users/repo/users.query.repository';
import { JwtService } from '../services/jwt-service';

@Injectable()
export class BasicAuthGuard implements CanActivate {
    constructor( protected jwtService: JwtService) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();

        const authHeader = request.headers['authorization'];
        if (!authHeader) {
            throw new UnauthorizedException();
        }

        const authName = authHeader.split(' ')[0];
        if (authName !== 'Basic') {
            throw new UnauthorizedException();
        }
        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [username, password] = credentials.split(':');


        if (username !== 'admin' || password !== 'qwerty') {
            throw new UnauthorizedException();
        }
        return true;

    }
}
