import { NextFunction, Request, Response } from "express";
import { HTTP_STATUSES } from "../utils";
import { jwtService } from "../application/jwt-service";
import { usersQueryRepo } from "../repositories/usersQueryRepository";


export const accessTokenGuard = async (req: Request, 
                                        res: Response, 
                                        next: NextFunction) => {
    if(!req.headers.authorization) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);

    const token = req.headers.authorization.split(' ')[1];
    const jwtObj = await jwtService.getUserIdByToken(token)
    if(jwtObj){
        const user = await usersQueryRepo.getUserById(jwtObj.userId)

        if(!user) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);

        req.user = user;
        return next();
    }
    return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
}