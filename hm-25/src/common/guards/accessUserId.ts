import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { JwtService } from '../services/jwt-service';
import { UsersQueryRepo } from '../../features/users/repo/users.query.repository';

@Injectable()
export class AccessUserId implements CanActivate {
    constructor(protected usersQueryRepo: UsersQueryRepo,
                protected jwtService: JwtService) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();

        if (!request.headers.authorization) return true;

        const accessToken = request.headers.authorization.split(' ')[1];
        const accessTokenData = await this.jwtService.getUserIdByToken(accessToken);
        accessTokenData.userId ? request.userId = accessTokenData.userId : '';
        return true

        // const refreshToken = request.cookies.refreshToken;

        // if(!refreshToken) return true;
        // const refreshTokenData = await this.jwtService.getRefreshTokenData(refreshToken);
        // refreshTokenData.userId ? request.userId = refreshTokenData.userId : '';
        // return true;
    }
}
