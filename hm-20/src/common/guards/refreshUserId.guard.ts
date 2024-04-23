import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { JwtService } from '../services/jwt-service';
import { UsersQueryRepo } from '../../features/users/repo/users.query.repository';

@Injectable()
export class RefreshUserId implements CanActivate {
    constructor(protected usersQueryRepo: UsersQueryRepo,
                protected jwtService: JwtService) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();

        const refreshToken = request.cookies.refreshToken;
        if(refreshToken){
            const refreshTokenData = await this.jwtService.getRefreshTokenData(refreshToken);
            refreshTokenData.userId ? request.userId = refreshTokenData.userId : '';
        }
        return true;
    }
}
