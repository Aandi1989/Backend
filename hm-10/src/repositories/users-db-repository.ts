import { usersModel } from "../db/models";
import { Result, ResultCode, UserAccountDBType, UserOutputType } from "../types/types";


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
    _mapDBAccountToUserOutputType(user: UserAccountDBType): UserOutputType{
        return{
            id:user.accountData.id,
            login: user.accountData.login,
            email: user.accountData.email,
            createdAt: user.accountData.createdAt
        }
    },
}