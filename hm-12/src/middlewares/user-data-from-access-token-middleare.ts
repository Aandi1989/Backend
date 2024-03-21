import { NextFunction, Request, Response } from "express";
import { jwtService, usersQueryRepo } from "../composition-root";


export const userDataFromAccessToken = async(req: Request, res: Response, next: NextFunction) => {
    if(!req.headers.authorization) return next();

    const accessToken = req.headers.authorization.split(' ')[1];
    const accessTokenData = await jwtService.getUserIdByToken(accessToken);

    if(accessTokenData){
        const user = await usersQueryRepo.getUserById(accessTokenData.userId);
        if(!user) return next();
        req.user = user;
        return next();
    }
    return next();
    }