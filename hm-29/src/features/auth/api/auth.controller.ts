import { BadRequestException, Body, Controller, Get, HttpCode, HttpException, Ip, Post, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { AuthBodyModel } from "./models/input/login.input.model";
import { LoginOutputModel } from "./models/output/login.output.model";
import { CheckCredentialsCommand } from "../application/use-case/check-credentials.use-case";
import { Request, Response } from 'express';
import { MeOutputModel } from "./models/output/me.output.model";
import { CreateAccountCommand } from "../application/use-case/create-account.use-case";
import { ConfirmEmailCommand } from "../application/use-case/confirm-email.use-case";
import { ConfirmCodeModel } from "./models/input/confirm.code.model";
import { ResendEmailModel } from "./models/input/resend.email.model";
import { ResendEmailCommand } from "../application/use-case/resend-email.use-case";
import { RecoveryCodeCommand } from "../application/use-case/recovery-code.use-case";
import { ChangePasswordModel } from "./models/input/change.password.model";
import { ChangeCodeCommand } from "../application/use-case/change-code.use-case";
import { ThrottlerGuard } from "@nestjs/throttler";
import { JwtService } from "../../../common/services/jwt-service";
import { RouterPaths, HTTP_STATUSES } from "../../../common/utils/utils";
import { AuthGuard } from "../../../common/guards/auth.guard";
import { ResultCode } from "../../../common/types/types";
import { RefreshTokensCommand } from "../../blogs/application/use-case/refresh-tokens.use-case";
import { CheckRefreshTokenCommand } from "../../security/application/use-case/check-refreshToken.use-case";
import { CreateSessionCommand } from "../../security/application/use-case/create-session.use-case";
import { RevokeSessionCommand } from "../../security/application/use-case/revoke-session.use-case";
import { CreateUserModel } from "../../users/api/models/input/create-user.input.model";
import { UsersQueryRepo } from "../../users/repo/users.query.repository";



@Controller(RouterPaths.auth)
export class AuthController {
    constructor(protected jwtService: JwtService,
                protected usersQueryRepo: UsersQueryRepo,
                private commandBus: CommandBus){}

    @UseGuards(ThrottlerGuard)
    @UseGuards(AuthGuard)
    @HttpCode(HTTP_STATUSES.OK_200)
    @Get('me')
    async me (@Req() req: Request): Promise<MeOutputModel | null>{
        const userId = req.user?.id;
        if(!userId) throw new UnauthorizedException();
        return await this.usersQueryRepo.getAuthById(userId);
    }
     
    // @UseGuards(ThrottlerGuard)
    @HttpCode(HTTP_STATUSES.OK_200)         
    @Post('login')
    async login (@Req() req: Request, @Body() body: AuthBodyModel, @Res() res: Response):Promise<LoginOutputModel>{
        const user = await this.commandBus.execute(new CheckCredentialsCommand(body));
        if(user){
            const accessToken = await this.jwtService.createAccessToken(user.id);
            const { refreshToken }  = await this.jwtService.createRefreshToken(user.id);
            const deviceName = req.headers['user-agent'];
            const ip = req.socket.remoteAddress!;
            const createdSession = await this.commandBus.execute(new CreateSessionCommand({refreshToken, ip, deviceName}))
            res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true }); 
            //@ts-ignore
            return res.send(accessToken);
        }
        throw new UnauthorizedException();
    }

    @HttpCode(HTTP_STATUSES.NO_CONTENT_204) 
    @Post('logout')
    async logout (@Req() req: Request){
        const refreshToken = req.cookies.refreshToken;
        const result = await this.commandBus.execute(new CheckRefreshTokenCommand(refreshToken));
        if(result.code !== ResultCode.Success) throw new UnauthorizedException();
        await this.commandBus.execute(new RevokeSessionCommand(result.data.deviceId));
    }

    @HttpCode(HTTP_STATUSES.OK_200)
    @Post('refresh-token')
    async refreshToken (@Req() req: Request, @Res() res: Response):Promise<LoginOutputModel>{
        const refreshToken = req.cookies.refreshToken;
        const response = await this.commandBus.execute(new CheckRefreshTokenCommand(refreshToken));
        if(response.code !== ResultCode.Success) throw new UnauthorizedException();
        const { newAccessToken, newRefreshToken } = await this.commandBus.execute
            (new RefreshTokensCommand (refreshToken, req.socket.remoteAddress!));
        res.cookie('refreshToken', newRefreshToken.refreshToken, { httpOnly: true, secure: true });
         //@ts-ignore 
        return res.send(newAccessToken);
    }

    @UseGuards(ThrottlerGuard)
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204) 
    @Post('registration')
    async registration (@Body() body:CreateUserModel){
        const result = await this.commandBus.execute(new CreateAccountCommand (body));
        if(result.code === ResultCode.Forbidden) throw new BadRequestException(result.errorsMessages);
        if(result.code === ResultCode.Failed) throw new BadRequestException();
        return;
    }

    @UseGuards(ThrottlerGuard)
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204) 
    @Post('registration-confirmation')
    async confirmEmail (@Body() body: ConfirmCodeModel){
        const result = await this.commandBus.execute(new ConfirmEmailCommand(body.code));
        if(result.code != ResultCode.Success) throw new BadRequestException(result.errorsMessages);
        return;
    }

    @UseGuards(ThrottlerGuard)
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204) 
    @Post('registration-email-resending')
    async registrationEmailResending (@Body() body: ResendEmailModel){
        const result = await this.commandBus.execute(new ResendEmailCommand(body.email));
        if(result.code != ResultCode.Success) throw new BadRequestException(result.errorsMessages);
        return;
    }

    @UseGuards(ThrottlerGuard)
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204) 
    @Post('password-recovery')
    async passwordRecovery (@Body() body: ResendEmailModel){
        const result = await this.commandBus.execute(new RecoveryCodeCommand(body.email));
        if(result.code != ResultCode.Success) throw new BadRequestException();
        return;
    }

    @UseGuards(ThrottlerGuard)
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204) 
    @Post('new-password')
    async newPassword (@Body() body: ChangePasswordModel){
        const result = await this.commandBus.execute(new ChangeCodeCommand(body));
        if(result.code != ResultCode.Success) throw new BadRequestException();
        return;
    }

}
