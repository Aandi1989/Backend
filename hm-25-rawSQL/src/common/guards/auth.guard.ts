import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { JwtService } from '../services/jwt-service';
import { UsersQueryRepo } from '../../features/users/repo/users.query.repository';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(protected usersQueryRepo: UsersQueryRepo,
        protected jwtService: JwtService) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();

        if (!request.headers.authorization) throw new UnauthorizedException();

        const accessToken = request.headers.authorization.split(' ')[1];
        const accessTokenData = await this.jwtService.getUserIdByToken(accessToken);

        if (accessTokenData) {
            if(!accessTokenData.userId) throw new UnauthorizedException();
            
            const user = await this.usersQueryRepo.getUserById(accessTokenData.userId)

            if (!user) throw new UnauthorizedException();

            request.user = user;
            return true;
        }
        throw new UnauthorizedException();
    }
}
