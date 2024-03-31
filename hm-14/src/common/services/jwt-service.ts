import * as jwt from 'jsonwebtoken';
import { appConfig } from "../../../config";
import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';


@Injectable()
export class JwtService {
    constructor(){}
    async createAccessToken(userId: string){
        const accessToken = jwt.sign({userId: userId}, appConfig.JWT_ACCESS_SECRET, {expiresIn: appConfig.EXPIRE_ACCESS_TOKER_TIME})
        return {
            "accessToken": accessToken
        }
    }
    async createRefreshToken(userId: string, deviceId: string = uuidv4()){
        const refreshToken = jwt.sign({userId: userId, deviceId: deviceId}, appConfig.JWT_REFRESH_SECRET, {expiresIn: appConfig.EXPIRE_REFRESH_TOKEN_TIME})
        return {
            "refreshToken": refreshToken
        }
    }
    async getUserIdByToken(token: string){
        try{
            const result: any = jwt.verify(token, appConfig.JWT_ACCESS_SECRET)
            return result
        }catch(error){
            return error
        }
    }
    async getRefreshTokenData(token: string){
        try {
            const result: any = jwt.verify(token, appConfig.JWT_REFRESH_SECRET)
            return result
        } catch (error) {
            return error
        }
    }
}