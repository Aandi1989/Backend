import express, { Request, Response } from "express";
import { jwtService } from "../../application/jwt-service";
import { authService } from "../../domain/auth-service";
import { usersService } from "../../domain/users-service";
import { accessTokenGuard } from "../../middlewares/access-token-guard-middleware";
import { authValidator } from "../../middlewares/auth-bodyValidation";
import { inputValidationMiddleware } from "../../middlewares/posts-bodyValidation-middleware";
import { emailCofirmCodeValidator, emailValidator, newPasswordValidator, userCreateValidator } from "../../middlewares/users-bodyValidation-middleware";
import { usersQueryRepo } from "../../repositories/usersQueryRepository";
import { RequestWithBody, ResultCode } from "../../types/types";
import { HTTP_STATUSES } from "../../utils";
import { CreateUserModel } from "../users/models/CreateUserModel";
import { AuthBodyModel } from "./Models/AuthBodyModel";
import { ConfirmCodeModel } from "./Models/ConfirCodeModel";
import { ResendEmailModel } from "./Models/ResendEmailModel";
import { apiCallsGuard } from "../../middlewares/api-calls-limit-guard-middleware";
import { RecoverPasswordModel } from "./Models/RecoverPasswordModel";


export const getAuthRouter = () => {
    const router = express.Router();
    router.get('/me',
        accessTokenGuard,
        async (req: Request, res: Response) => {
            const userId = req.user?.id;

            if(!userId) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
            const me = await usersQueryRepo.getAuthById(userId) ;

            return res.status(HTTP_STATUSES.OK_200).send(me)
        }),
    router.post('/login',
        ...authValidator,
        inputValidationMiddleware,
        apiCallsGuard,
        async(req:RequestWithBody<AuthBodyModel>, res:Response) => {
            const user = await usersService.checkCredentials(req.body)
            if(user){
                const deviceName = req.headers['user-agent'];
                const accessToken = await jwtService.createAccessToken(user.accountData.id)
                const { refreshToken }  = await jwtService.createRefreshToken(user.accountData.id)
                const createdSession = await authService.createSession(refreshToken, req.ip!, deviceName)
                res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true }); 
                return res.status(HTTP_STATUSES.OK_200).send(accessToken)
            }else{
                return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
            }
        }),
    router.post('/logout',
        async(req: Request, res: Response) => {
            const refreshToken = req.cookies.refreshToken;
            const response = await authService.checkRefreshToken(refreshToken);
            if(response.code !== ResultCode.Success) return res.send(HTTP_STATUSES.UNAUTHORIZED_401);
            const result = await authService.revokeSession(refreshToken);
            return res.send(HTTP_STATUSES.NO_CONTENT_204);
        }),
    router.post('/refresh-token',
        async(req: Request, res: Response) => {
            const refreshToken = req.cookies.refreshToken;
            const response = await authService.checkRefreshToken(refreshToken);
            if(response.code !== ResultCode.Success) return res.send(HTTP_STATUSES.UNAUTHORIZED_401);
            const { newAccessToken, newRefreshToken } = await authService.refreshToken(refreshToken, req.ip!);
            res.cookie('refreshToken', newRefreshToken.refreshToken, { httpOnly: true, secure: true }); 
            return res.status(HTTP_STATUSES.OK_200).send(newAccessToken)
        }),
    router.post('/registration',
        ...userCreateValidator,
        inputValidationMiddleware,
        apiCallsGuard,
        async (req: RequestWithBody<CreateUserModel>, res: Response) => {
            const result = await authService.createUserAccount(req.body);
            if(result.code === ResultCode.Success) return res.send(HTTP_STATUSES.NO_CONTENT_204)
            if(result.code === ResultCode.Forbidden) return res.status(HTTP_STATUSES.BAD_REQUEST_400).send(result.errorsMessages)
            if(result.code === ResultCode.Failed) return res.send(HTTP_STATUSES.BAD_REQUEST_400)
        }),
    router.post('/registration-confirmation',
        emailCofirmCodeValidator,
        inputValidationMiddleware,
        apiCallsGuard,
        async (req: RequestWithBody<ConfirmCodeModel>, res: Response) => {
            const result = await authService.confirmEmail(req.body.code);
            if(result.code === ResultCode.Success) return res.send(HTTP_STATUSES.NO_CONTENT_204)
            return res.status(HTTP_STATUSES.BAD_REQUEST_400).send(result.errorsMessages)
        }),
    router.post('/registration-email-resending',
        emailValidator,
        inputValidationMiddleware,
        apiCallsGuard,
        async (req: RequestWithBody<ResendEmailModel>, res: Response) => {
            const result = await authService.resendEmail(req.body.email);
            if(result.code === ResultCode.Success) return res.send(HTTP_STATUSES.NO_CONTENT_204)
            return res.status(HTTP_STATUSES.BAD_REQUEST_400).send(result.errorsMessages)
        }),
    router.post('/password-recovery',
        emailValidator,
        inputValidationMiddleware,
        apiCallsGuard,
        async (req: RequestWithBody<ResendEmailModel>, res: Response) => {
            const result = await authService.sendRecoveryCode(req.body.email)
            if(result.code != ResultCode.Failed) return res.send(HTTP_STATUSES.NO_CONTENT_204)
            return res.send(HTTP_STATUSES.BAD_REQUEST_400)
        }),
    router.post('/new-password',
        newPasswordValidator,
        inputValidationMiddleware,
        apiCallsGuard,
        async (req: RequestWithBody<RecoverPasswordModel>, res: Response) => {
            const result = await authService.changePassword(req.body.newPassword, req.body.recoveryCode);
            if(result.code === ResultCode.Success) return res.send(HTTP_STATUSES.NO_CONTENT_204);
            return res.send(HTTP_STATUSES.BAD_REQUEST_400)
        })
    return router;
}

// $2b$10$8Zh.OzrsQOfHeWyGpDoP4.dIg2U0qjlDBD9v3BLdbwVYP/CA8gIL6

// $2b$10$8Zh.OzrsQOfHeWyGpDoP4.dIg2U0qjlDBD9v3BLdbwVYP/CA8gIL6