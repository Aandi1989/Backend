import { NextFunction, Request, Response } from "express";
import { HTTP_STATUSES } from "../utils";
import { ResultCode } from "../types/types";
import { container } from "../composition-root";
import { JwtService } from "../application/jwt-service";
import { UsersQueryRepo } from "../repositories/usersQueryRepository";

const jwtService = container.resolve(JwtService);
const usersQueryRepo = container.resolve(UsersQueryRepo);


export const accessTokenGuard = async (req: Request, 
                                        res: Response, 
                                        next: NextFunction) => {
    if(!req.headers.authorization) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);

    const accessToken = req.headers.authorization.split(' ')[1];
    const accessTokenData = await jwtService.getUserIdByToken(accessToken);

    // logic to create and renew refreshToken with each made request
    // ------------------------------------------------
    // const refreshToken = req.cookies.refreshToken;
    // const refreshTokenData = await jwtService.getRefreshTokenData(refreshToken);

    // const refreshTokenCheckResult = await authService.checkRefreshToken(refreshToken);

    // if(refreshTokenCheckResult.code !== ResultCode.Success) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);

    // if(accessTokenData.userId || accessTokenData.message == 'jwt expired'){
    //     const user = await usersQueryRepo.getUserById(accessTokenData.userId)
    //     if(!user) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
       
    //     const newRefreshToken = await jwtService.createRefreshToken(accessTokenData.userId);
    //     const revokedToken = await authService.revokeToken(refreshToken);
    //     const addedToken = await authService.addToken(newRefreshToken); /*we dont need this line if we dont save valid refreshTokens in db*/
        
    //     res.cookie('refreshToken', newRefreshToken.refreshToken, { httpOnly: true, secure: true }); 

    // --------------------------------------------------
        if(accessTokenData){
            const user = await usersQueryRepo.getUserById(accessTokenData.userId)

        if(!user) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);

    //---------------------------------------------------
        req.user = user;
        return next();
    }
    return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
}

