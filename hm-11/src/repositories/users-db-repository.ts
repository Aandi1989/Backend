import { ObjectId } from "mongodb";
import { usersModel } from "../db/models";
import { Result, ResultCode, UserAccountDBType, UserOutputType, codeRecoveryType } from "../types/types";


export const usersRepository = {
    async createUser(newAccount: UserAccountDBType): Promise<Result>{
        const result = await usersModel.insertMany([newAccount]);
        const userOutput = this._mapDBAccountToUserOutputType(newAccount);
        return {code: ResultCode.Success, data: userOutput}
            
    },
    async deleteUser(id: string): Promise<boolean>{
        const result = await usersModel.deleteOne({'accountData.id': id})
        return result.deletedCount === 1
    },
    async updateCodeRecovery( _id: ObjectId, codeDate: codeRecoveryType){
        const result = await usersModel.updateOne({_id}, {$set: {
            'codeRecoveryInfo.recoveryCode': codeDate.recoveryCode,
            'codeRecoveryInfo.expirationDate': codeDate.expirationDate,
            'codeRecoveryInfo.isConfirmed': codeDate.isConfirmed,
        }});
        return result;
    },
    async changePassword(_id: ObjectId, passwordSalt: string, passwordHash: string){
        const result = await usersModel.updateOne({_id},{$set: {
            'accountData.passwordHash':passwordHash,
            'accountData.passwordSalt':passwordSalt, 
            'codeRecoveryInfo.isConfirmed': true
        }});
        return result;
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