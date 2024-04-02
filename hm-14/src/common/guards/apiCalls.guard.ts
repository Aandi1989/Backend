import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, HttpException } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { UsersQueryRepo } from 'src/features/users/repo/users.query.repository';
import { JwtService } from '../services/jwt-service';
import { CommandBus } from '@nestjs/cqrs';
import { SecurityQueryRepo } from 'src/features/security/repo/security.query.repository';
import { AddRequestCommand } from 'src/features/security/application/use-case/add-request.use-case';
import { ApiCallModel } from 'src/features/security/api/models/input/api-call.input.model';
import { HTTP_STATUSES } from '../utils/utils';

@Injectable()
export class ApiCallsGuard implements CanActivate {
    constructor(protected securityQueryRepo: SecurityQueryRepo,
                private commandBus: CommandBus) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();

        const currentDateMinus10Sec = new Date(Date.now() - 10000);

        const newRequest: ApiCallModel = {
            ip: request.socket.remoteAddress!,
            url: request.url,
            date: new Date()
        }

        const addedRequest = await this.commandBus.execute(new AddRequestCommand(newRequest));
        const count = await this.securityQueryRepo.countRequests(newRequest, currentDateMinus10Sec);

        if(count > 5) throw new HttpException('Too many requests', HTTP_STATUSES.TO_MANY_REQUESTS_429);
        
        return true;
    }
}
