import { ObjectId } from "mongodb";
import { apiCallsCollection, inValidTokenCollection, sessionsCollection, usersAcountsCollection } from "../db/db";
import { Result, ResultCode, apiCallType, sessionType } from "../types/types";


export const authRepository = {
    async confirmEmail(_id: ObjectId): Promise<Result>{
        const result = await usersAcountsCollection.updateOne({_id}, {$set: {'emailConfirmation.isConfirmed': true}})
        return result.modifiedCount === 1 ? {code: ResultCode.Success} : {code: ResultCode.Failed};
    },
    async updateConfirmationCode(_id: ObjectId, newCode: string): Promise<Result>{
        const result = await usersAcountsCollection.updateOne({_id}, {$set: {'emailConfirmation.confirmationCode': newCode}})
        return result.modifiedCount === 1 ? {code: ResultCode.Success} : {code: ResultCode.Failed};
    },
    async revokeToken(token: string){
        const result = await inValidTokenCollection.insertOne({refreshToken: token})
        return result
    },
    async addRequest(request: apiCallType){
        const result = await apiCallsCollection.insertOne(request);
        return result;
    },
    async createSession(newSession: sessionType){
        const result = await sessionsCollection.insertOne(newSession);
        return result;
    }
}