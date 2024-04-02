import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, HttpCode, NotFoundException, Param, Post, Put, Query, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { Response, Request } from 'express';
import { commentQueryParams, postQueryParams } from "src/common/helpers/queryStringModifiers";
import { CommentQueryType } from "../../comments/types/types";
import { RouterPaths, HTTP_STATUSES } from "src/common/utils/utils";
import { CommentOutputModel, CommentsWithQueryOutputModel } from "src/features/comments/api/models/output/comment.output.model";
import { CommandBus } from "@nestjs/cqrs";
import { AuthGuard } from "src/common/guards/auth.guard";
import { CreateCommentModel } from "src/features/comments/api/models/input/create-comment.input.model";
import { CreateCommentCommand } from "src/features/comments/application/use-case/create-comment.use-case";
import { SetStatusModel } from "../../likes/api/models/input/set-status.input.model";
import { LikePostCommand } from "../../likes/application/use-cases/like-post.use-case";
import { ResultCode } from "src/common/types/types";
import { UserId } from "src/common/guards/userId.guard";
import { SecurityQueryRepo } from "../repo/security.query.repository";
import { SessionOutputModel } from "./models/output/security.output.model";
import { CheckSecurityRefreshTokenCommand } from "../application/use-case/check-security-refreshToken.use-case.";
import { JwtService } from "src/common/services/jwt-service";
import { DeleteSessionModel } from "./models/input/delete-session.input.model";
import { RevokeSessionCommand } from "../application/use-case/revoke-session.use-case";
import { RevokeSessionsCommand } from "../application/use-case/revoke-sessions.use-case";


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
        return await this.commandBus.execute(new RevokeSessionCommand(refreshToken));
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