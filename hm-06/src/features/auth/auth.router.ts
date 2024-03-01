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
        }
    )
    return router;
}