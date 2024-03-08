import { ObjectId } from "mongodb";
import { inValidTokenCollection, usersAcountsCollection, validTokenCollection } from "../db/db";
import { Result, ResultCode, refreshTokenType } from "../types/types";


export const authRepository = {
    async confirmEmail(_id: ObjectId): Promise<Result>{
        const result = await usersAcountsCollection.updateOne({_id}, {$set: {'emailConfirmation.isConfirmed': true}})
        return result.modifiedCount === 1 ? {code: ResultCode.Success} : {code: ResultCode.Failed};
    },
    async updateConfirmationCode(_id: ObjectId, newCode: string): Promise<Result>{
        const result = await usersAcountsCollection.updateOne({_id}, {$set: {'emailConfirmation.confirmationCode': newCode}})
        return result.modifiedCount === 1 ? {code: ResultCode.Success} : {code: ResultCode.Failed};
    },
    async addToken(token: refreshTokenType){
        const result = await validTokenCollection.insertOne(token)
        return result
    },
    async revokeToken(token: refreshTokenType){
        const result = await inValidTokenCollection.insertOne(token)
        return result
    }
}