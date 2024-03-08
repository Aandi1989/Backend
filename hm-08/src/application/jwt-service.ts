import { DBUserType, UserType } from "../types/types";
import jwt from 'jsonwebtoken';
import { appConfig } from "../../config";



export const jwtService = {
    async createAccessToken(user: UserType){
        const accessToken = jwt.sign({userId: user.id}, appConfig.JWT_ACCESS_SECRET, {expiresIn: appConfig.EXPIRE_ACCESS_TOKER_TIME})
        return {
            "accessToken": accessToken
        }
    },
    async createRefreshToken(user: UserType){
        const refreshToken = jwt.sign({userId: user.id}, appConfig.JWT_REFRESH_SECRET, {expiresIn: appConfig.EXPIRE_REFRESH_TOKEN_TIME})
        return {
            "refreshToken": refreshToken
        }
    },
    async getUserIdByToken(token: string){
        try{
            const result: any = jwt.verify(token, appConfig.JWT_ACCESS_SECRET)
            return result
        }catch(error){
            return null
        }
    },
    async getRefreshTokenData(token: string){
        try {
            const result: any = jwt.verify(token, appConfig.JWT_REFRESH_SECRET)
            return result
        } catch (error) {
            return null
        }
    }
}
