import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { UsersService } from 'src/features/users/application/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(protected usersService: UsersService) {}
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request: Request = context.switchToHttp().getRequest();

        console.log(this.usersService) /* or JwtService if necessary*/
        console.log(request.headers.authorization)

        // if we want to throw 401 error instead default 403 and if necessary edit this error inside exception.filter 
        // throw new UnauthorizedException()

        return false;
    }
}
