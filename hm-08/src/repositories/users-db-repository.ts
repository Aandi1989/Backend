import { ObjectId } from "mongodb";
import { usersAcountsCollection } from "../db/db";
import { Result, ResultCode, UserAccountDBType, UserOutputType } from "../types/types";


export const usersRepository = {
    async createUser(newAccount: UserAccountDBType): Promise<Result>{
            const result = await usersAcountsCollection.insertOne(newAccount);
            const userOutput = this._mapDBAccountToUserOutputType(newAccount);
            return {code: ResultCode.Success, data: userOutput}
            
    },
    async deleteUser(id: string): Promise<boolean>{
        const result = await usersAcountsCollection.deleteOne({'accountData.id': id})
        return result.deletedCount === 1
    },
    async confirmEmail(_id: ObjectId): Promise<Result>{
        const result = await usersAcountsCollection.updateOne({_id}, {$set: {'emailConfirmation.isConfirmed': true}})
        return result.modifiedCount === 1 ? {code: ResultCode.Success} : {code: ResultCode.Failed};
    },
    async updateConfirmationCode(_id: ObjectId, newCode: string): Promise<Result>{
        const result = await usersAcountsCollection.updateOne({_id}, {$set: {'emailConfirmation.confirmationCode': newCode}})
        return result.modifiedCount === 1 ? {code: ResultCode.Success} : {code: ResultCode.Failed};
    },
    _mapDBAccountToUserOutputType(user: UserAccountDBType): UserOutputType{
        return{
            id:user.accountData.id,
            login: user.accountData.login,
            email: user.accountData.email,
            createdAt: user.accountData.createdAt
        }
    },
}