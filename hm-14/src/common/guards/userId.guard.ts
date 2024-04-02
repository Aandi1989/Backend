import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { UsersQueryRepo } from 'src/features/users/repo/users.query.repository';
import { JwtService } from '../services/jwt-service';

@Injectable()
export class UserId implements CanActivate {
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
