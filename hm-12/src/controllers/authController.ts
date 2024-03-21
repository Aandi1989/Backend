import { Request, Response, Router } from "express";
import { JwtService } from "../application/jwt-service";
import { AuthService } from "../domain/auth-service";
import { UsersService } from "../domain/users-service";
import { AuthBodyModel } from "../features/auth/Models/AuthBodyModel";
import { ConfirmCodeModel } from "../features/auth/Models/ConfirCodeModel";
import { RecoverPasswordModel } from "../features/auth/Models/RecoverPasswordModel";
import { ResendEmailModel } from "../features/auth/Models/ResendEmailModel";
import { CreateUserModel } from "../features/users/models/CreateUserModel";
import { UsersQueryRepo } from "../repositories/usersQueryRepository";
import { RequestWithBody, ResultCode } from "../types/types";
import { HTTP_STATUSES } from "../utils";
import { injectable } from "inversify";

@injectable()
export class AuthController {
    constructor(protected usersQueryRepo: UsersQueryRepo,
                protected jwtService: JwtService,
                protected authService: AuthService,
                protected usersService: UsersService){}
    async me (req: Request, res: Response) {
        const userId = req.user?.id;
        if(!userId) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        const me = await this.usersQueryRepo.getAuthById(userId) ;
        return res.status(HTTP_STATUSES.OK_200).send(me)
    }
    async login (req:RequestWithBody<AuthBodyModel>, res:Response) {
        const user = await this.usersService.checkCredentials(req.body)
        if(user){
            const deviceName = req.headers['user-agent'];
            const accessToken = await this.jwtService.createAccessToken(user.accountData.id)
            const { refreshToken }  = await this.jwtService.createRefreshToken(user.accountData.id)
            const createdSession = await this.authService.createSession(refreshToken, req.ip!, deviceName)
            res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true }); 
            return res.status(HTTP_STATUSES.OK_200).send(accessToken)
        }else{
            return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        }
    }
    async logout (req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken;
        const response = await this.authService.checkRefreshToken(refreshToken);
        if(response.code !== ResultCode.Success) return res.send(HTTP_STATUSES.UNAUTHORIZED_401);
        const result = await this.authService.revokeSession(refreshToken);
        return res.send(HTTP_STATUSES.NO_CONTENT_204);
    }
    async refreshToken (req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken;
        const response = await this.authService.checkRefreshToken(refreshToken);
        if(response.code !== ResultCode.Success) return res.send(HTTP_STATUSES.UNAUTHORIZED_401);
        const { newAccessToken, newRefreshToken } = await this.authService.refreshToken(refreshToken, req.ip!);
        res.cookie('refreshToken', newRefreshToken.refreshToken, { httpOnly: true, secure: true }); 
        return res.status(HTTP_STATUSES.OK_200).send(newAccessToken)
    }
    async registration (req: RequestWithBody<CreateUserModel>, res: Response) {
        const result = await this.authService.createUserAccount(req.body);
        if(result.code === ResultCode.Success) return res.send(HTTP_STATUSES.NO_CONTENT_204)
        if(result.code === ResultCode.Forbidden) return res.status(HTTP_STATUSES.BAD_REQUEST_400).send(result.errorsMessages)
        if(result.code === ResultCode.Failed) return res.send(HTTP_STATUSES.BAD_REQUEST_400)
    }
    async registrationConfirmation (req: RequestWithBody<ConfirmCodeModel>, res: Response) {
        const result = await this.authService.confirmEmail(req.body.code);
        if(result.code === ResultCode.Success) return res.send(HTTP_STATUSES.NO_CONTENT_204)
        return res.status(HTTP_STATUSES.BAD_REQUEST_400).send(result.errorsMessages)
    }
    async registrationEmailResending (req: RequestWithBody<ResendEmailModel>, res: Response) {
        const result = await this.authService.resendEmail(req.body.email);
        if(result.code === ResultCode.Success) return res.send(HTTP_STATUSES.NO_CONTENT_204)
        return res.status(HTTP_STATUSES.BAD_REQUEST_400).send(result.errorsMessages)
    }
    async passwordRecovery (req: RequestWithBody<ResendEmailModel>, res: Response) {
        const result = await this.authService.sendRecoveryCode(req.body.email)
        if(result.code != ResultCode.Failed) return res.send(HTTP_STATUSES.NO_CONTENT_204)
        return res.send(HTTP_STATUSES.BAD_REQUEST_400)
    }
    async newPassword (req: RequestWithBody<RecoverPasswordModel>, res: Response) {
        const result = await this.authService.changePassword(req.body.newPassword, req.body.recoveryCode);
        if(result.code === ResultCode.Success) return res.send(HTTP_STATUSES.NO_CONTENT_204);
        if(result.code === ResultCode.NotFound) {
            return res.status(HTTP_STATUSES.BAD_REQUEST_400).send(result.errorsMessages)
        }
        return res.send(HTTP_STATUSES.BAD_REQUEST_400)
    }
}