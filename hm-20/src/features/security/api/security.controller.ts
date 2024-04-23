import { Controller, Delete, ForbiddenException, Get, HttpCode, NotFoundException, Param, Req, UnauthorizedException } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { Request } from 'express';
import { CheckSecurityRefreshTokenCommand } from "../application/use-case/check-security-refreshToken.use-case.";
import { RevokeSessionCommand } from "../application/use-case/revoke-session.use-case";
import { RevokeSessionsCommand } from "../application/use-case/revoke-sessions.use-case";
import { SecurityQueryRepo } from "../repo/security.query.repository";
import { DeleteSessionModel } from "./models/input/delete-session.input.model";
import { SessionOutputModel } from "./models/output/security.output.model";
import { JwtService } from "../../../common/services/jwt-service";
import { ResultCode } from "../../../common/types/types";
import { RouterPaths, HTTP_STATUSES } from "../../../common/utils/utils";


@Controller(RouterPaths.security)
export class SecurytyController{
    constructor(protected securityQueryRepo: SecurityQueryRepo,
                protected jwtService: JwtService,
                private commandBus: CommandBus){}
    
    @HttpCode(HTTP_STATUSES.OK_200)            
    @Get('devices') 
    async getSessions(@Req() req: Request): Promise<SessionOutputModel[]>{
        const refreshToken = req.cookies.refreshToken;
        const result = await this.commandBus.execute(new CheckSecurityRefreshTokenCommand(refreshToken));

        if(result.code != ResultCode.Success) throw new UnauthorizedException();
        return await this.securityQueryRepo.getSessions(result.data.userId);
    }
   
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    @Delete('devices/:id')
    async deleteSession(@Req() req: Request, @Param() body: DeleteSessionModel){
        const refreshToken = req.cookies.refreshToken;
        const result = await this.commandBus.execute(new CheckSecurityRefreshTokenCommand(refreshToken, body.id));
        if(result.code === ResultCode.Forbidden) throw new ForbiddenException();
        if(result.code === ResultCode.Failed) throw new UnauthorizedException();
        if(result.code === ResultCode.NotFound) throw new NotFoundException();
        return await this.commandBus.execute(new RevokeSessionCommand(body.id));
    }
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    @Delete('devices')
    async deleteSessions(@Req() req: Request){
        const refreshToken = req.cookies.refreshToken;
        const result = await this.commandBus.execute(new CheckSecurityRefreshTokenCommand(refreshToken));
        if(result.code != ResultCode.Success) throw new UnauthorizedException();
        return await this.commandBus.execute(new RevokeSessionsCommand(result.data.userId, result.data.deviceId))
    }
}