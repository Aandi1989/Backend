import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import config from '../settings/configuration';


@Injectable()
export class JwtService {
    constructor(){}
    async createAccessToken(userId: string){
        const accessToken = jwt.sign({userId: userId}, config().jwtSetting.JWT_ACCESS_SECRET, {expiresIn: config().jwtSetting.EXPIRE_ACCESS_TOKEN_TIME})
        return {
            "accessToken": accessToken
        }
    }
    async createRefreshToken(userId: string, deviceId: string = uuidv4()){
        const refreshToken = jwt.sign({userId: userId, deviceId: deviceId}, config().jwtSetting.JWT_REFRESH_SECRET, {expiresIn: config().jwtSetting.EXPIRE_REFRESH_TOKEN_TIME})
        return {
            "refreshToken": refreshToken
        }
    }
    async getUserIdByToken(token: string){
        try{
            const result: any = jwt.verify(token, config().jwtSetting.JWT_ACCESS_SECRET)
            return result
        }catch(error){
            return error
        }
    }
    async getRefreshTokenData(token: string){
        try {
            const result: any = jwt.verify(token, config().jwtSetting.JWT_REFRESH_SECRET)
            return result
        } catch (error) {
            return error
        }
    }
}