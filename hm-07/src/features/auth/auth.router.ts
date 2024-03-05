import express, { Response, Request } from "express";
import { inputValidationMiddleware } from "../../middlewares/posts-bodyValidation-middleware";
import { authValidator } from "../../middlewares/auth-bodyValidation";
import { RequestWithBody } from "../../types/types";
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
                const token = await jwtService.createJWT(user)
                res.status(HTTP_STATUSES.OK_200).send(token)
            }else{
                res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
            }
        }),
    router.post('/registration',
        ...userCreateValidator,
        inputValidationMiddleware,
        async (req: RequestWithBody<CreateUserModel>, res: Response) => {
            const account = await authService.createUserAccount(req.body)
            if(account){
                res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
            }else{
                res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            }
        }),
    router.post('/registration-confirmation',
        emailCofirmCodeValidator,
        inputValidationMiddleware,
        async (req: RequestWithBody<ConfirmCodeModel>, res: Response) => {
            const {code} = req.body;
            const isConfirmed = await authService.confirmEmail(code);
            if(!isConfirmed) return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
            return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        }),
    router.post('/registration-email-resending',
        emailValidator,
        inputValidationMiddleware,
        async (req: RequestWithBody<ResendEmailModel>, res: Response) => {
            const {email} = req.body;
            const emailResended = await authService.resendEmail(email);
            if(!emailResended) return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
            return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        })
    return router;
}