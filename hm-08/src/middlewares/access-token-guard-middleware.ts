import { NextFunction, Request, Response } from "express";
import { HTTP_STATUSES } from "../utils";
import { jwtService } from "../application/jwt-service";
import { usersQueryRepo } from "../repositories/usersQueryRepository";
import { authService } from "../domain/auth-service";
import { ResultCode } from "../types/types";


export const accessTokenGuard = async (req: Request, 
                                        res: Response, 
                                        next: NextFunction) => {
    if(!req.headers.authorization) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);

    const accessToken = req.headers.authorization.split(' ')[1];
    const accessTokenData = await jwtService.getUserIdByToken(accessToken);
    const refreshToken = req.cookies.refreshToken;
    const refreshTokenData = await jwtService.getRefreshTokenData(refreshToken);

    const refreshTokenCheckResult = await authService.checkRefreshToken(refreshToken);

    if(refreshTokenCheckResult.code !== ResultCode.Success) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);

    if(accessTokenData.userId || accessTokenData.message == 'jwt expired'){
        const user = await usersQueryRepo.getUserById(accessTokenData.userId)
        if(!user) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
       
        const newRefreshToken = await jwtService.createRefreshToken(accessTokenData.userId);
        const revokedToken = await authService.revokeToken(refreshToken);
        const addedToken = await authService.addToken(newRefreshToken);
        
        res.cookie('refreshToken', newRefreshToken.refreshToken, { httpOnly: true, secure: true }); 
        req.user = user;
        return next();
    }
    return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
}

// if(accessTokenData.userId){
    //     const user = await usersQueryRepo.getUserById(accessTokenData.userId)
    //     if(!user) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    //     const newRefreshToken = await jwtService.createRefreshToken(accessTokenData.userId);
    //     const revokedToken = await authService.revokeToken(refreshToken);
    //     const addedToken = await authService.addToken(newRefreshToken);
    //     res.cookie('refreshToken', newRefreshToken.refreshToken, { httpOnly: true, secure: true }); 
    //     req.user = user;
    // }
    // if(accessTokenData.message = 'jwt expired'){
    //     if(refreshTokenData.message = 'jwt expired'){
    //         const revokedToken = await authService.revokeToken(refreshToken);
    //         return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    //     }
    //     if(refreshTokenData.userId){
    //         const newRefreshToken = await jwtService.createRefreshToken(accessTokenData.userId);
    //         const revokedToken = await authService.revokeToken(refreshToken);
    //         const addedToken = await authService.addToken(newRefreshToken);
    //         res.cookie('refreshToken', newRefreshToken.refreshToken, { httpOnly: true, secure: true }); 
    //     }
    // }
    
    // return next();  

// if(Date.now() > accessTokenData.exp * 1000){
//     const refreshToken = req.cookies.refreshToken;
//     const refreshTokenData = await jwtService.getRefreshTokenData(refreshToken);
//     if(Date.now() > refreshTokenData.exp * 1000){
//         const revokedToken = await authService.revokeToken(refreshToken);
//         return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
//     }else{
//         const revokedToken = await authService.revokeToken(refreshToken);
//         const newRefreshToken = await jwtService.createRefreshToken(accessTokenData.userId);
//         const addedToken = await authService.addToken(newRefreshToken);
//         res.cookie('refreshToken', newRefreshToken.refreshToken, { httpOnly: true, secure: true }); 
//     }
// }