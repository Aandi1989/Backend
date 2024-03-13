import { ObjectId } from "mongodb";
import { apiCallsCollection, sessionsCollection, usersAcountsCollection } from "../db/db";
import { Result, ResultCode, apiCallType, refreshTokenDataType, sessionType } from "../types/types";


export const authRepository = {
    async confirmEmail(_id: ObjectId): Promise<Result>{
        const result = await usersAcountsCollection.updateOne({_id}, {$set: {'emailConfirmation.isConfirmed': true}})
        return result.modifiedCount === 1 ? {code: ResultCode.Success} : {code: ResultCode.Failed};
    },
    async updateConfirmationCode(_id: ObjectId, newCode: string): Promise<Result>{
        const result = await usersAcountsCollection.updateOne({_id}, {$set: {'emailConfirmation.confirmationCode': newCode}})
        return result.modifiedCount === 1 ? {code: ResultCode.Success} : {code: ResultCode.Failed};
    },
    async revokeSession(tokenData: refreshTokenDataType){
        const result = await sessionsCollection.deleteOne({userId: tokenData.userId, deviceId: tokenData.deviceId});
        return result;
    },
    async addRequest(request: apiCallType){
        const result = await apiCallsCollection.insertOne(request);
        return result;
    },
    async createSession(newSession: sessionType){
        const result = await sessionsCollection.insertOne(newSession);
        return result;
    },
    async updateSession(oldData:refreshTokenDataType, newData:refreshTokenDataType, ip:string){
        const oldIat = new Date (oldData.iat * 1000).toISOString();
        const newIat = new Date (newData.iat * 1000).toISOString();
        const newExp = new Date (newData.exp * 1000).toISOString();
        const result = await sessionsCollection.updateOne({userId: oldData.userId, deviceId: oldData.deviceId, iat: oldIat},
            { $set: {iat: newIat, exp: newExp, ip: ip }});
        return result;
    },
}