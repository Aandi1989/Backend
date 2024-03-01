import express, { Response, Request } from "express";
import { inputValidationMiddleware } from "../../middlewares/posts-bodyValidation-middleware";
import { authValidator } from "../../middlewares/auth-bodyValidation";
import { RequestWithBody } from "../../types";
import { AuthBodyModel } from "./Models/AuthBodyModel";
import { usersService } from "../../domain/users-service";
import { HTTP_STATUSES } from "../../utils";

export const getAuthRouter = () => {
    const router = express.Router();

    router.post('/login',
        ...authValidator,
        inputValidationMiddleware,
        async(req:RequestWithBody<AuthBodyModel>, res:Response) => {
            const checkResult = await usersService.checkCredentials(req.body)
            checkResult 
            ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) 
            : res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        }
    )
    return router;
}