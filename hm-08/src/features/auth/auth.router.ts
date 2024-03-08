import express, { Response, Request } from "express";
import { inputValidationMiddleware } from "../../middlewares/posts-bodyValidation-middleware";
import { authValidator } from "../../middlewares/auth-bodyValidation";
import { RequestWithBody, Result, ResultCode, UserOutputType } from "../../types/types";
import { AuthBodyModel } from "./Models/AuthBodyModel";
import { usersService } from "../../domain/users-service";
import { HTTP_STATUSES } from "../../utils";
import { jwtService } from "../../application/jwt-service";
import { accessTokenGuard } from "../../middlewares/access-token-guard-middleware";
import { usersQueryRepo } from "../../repositories/usersQueryRepository";
import { businessService } from "../../domain/business-service";
import { authService } from "../../domain/auth-service";
import { emailCofirmCodeValidator, emailValidator, userCreateValidator } from "../../middlewares/users-bodyValidation-middleware";
import { CreateUserModel } from "../users/models/CreateUserModel";
import { ConfirmCodeModel } from "./Models/ConfirCodeModel";
import { ResendEmailModel } from "./Models/ResendEmailModel";


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
        async(req:RequestWithBody<AuthBodyModel>, res:Response) => {
            const user = await usersService.checkCredentials(req.body)
            if(user){
                const accessToken = await jwtService.createAccessToken(user.accountData)
                const { refreshToken } = await jwtService.createRefreshToken(user.accountData)
                res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true }); 
                res.status(HTTP_STATUSES.OK_200).send(accessToken)
            }else{
                res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
            }
        }),
    router.post('/registration',
        ...userCreateValidator,
        inputValidationMiddleware,
        async (req: RequestWithBody<CreateUserModel>, res: Response) => {
            const result = await authService.createUserAccount(req.body);
            if(result.code === ResultCode.Success) return res.send(HTTP_STATUSES.NO_CONTENT_204)
            if(result.code === ResultCode.Forbidden) return res.status(HTTP_STATUSES.BAD_REQUEST_400).send(result.errorsMessages)
            if(result.code === ResultCode.Failed) return res.send(HTTP_STATUSES.BAD_REQUEST_400)
        }),
    router.post('/registration-confirmation',
        emailCofirmCodeValidator,
        inputValidationMiddleware,
        async (req: RequestWithBody<ConfirmCodeModel>, res: Response) => {
            const result = await authService.confirmEmail(req.body.code);
            if(result.code === ResultCode.Success) return res.send(HTTP_STATUSES.NO_CONTENT_204)
            return res.status(HTTP_STATUSES.BAD_REQUEST_400).send(result.errorsMessages)
        }),
    router.post('/registration-email-resending',
        emailValidator,
        inputValidationMiddleware,
        async (req: RequestWithBody<ResendEmailModel>, res: Response) => {
            const result = await authService.resendEmail(req.body.email);
            if(result.code === ResultCode.Success) return res.send(HTTP_STATUSES.NO_CONTENT_204)
            return res.status(HTTP_STATUSES.BAD_REQUEST_400).send(result.errorsMessages)
        })
    return router;
}