import { DBUserType } from "../types/types";
import jwt from 'jsonwebtoken';
import { appConfig } from "../../config";



export const jwtService = {
    async createJWT(user: DBUserType){
        const token = jwt.sign({userId: user.id}, appConfig.JWT_SECRET, {expiresIn: appConfig.EXPIRE_TIME})
        return {
            "accessToken": token
        }
    },
    async getUserIdByToken(token: string){
        try{
            const result: any = jwt.verify(token, appConfig.JWT_SECRET)
            return result
        }catch(error){
            return null
        }
    }
}
