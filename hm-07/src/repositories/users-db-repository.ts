import { usersAcountsCollection, usersCollection } from "../db/db";
import { DBUserType, UserAccountDBType, UserOutputType, UserType } from "../types/types";


export const usersRepository = {
    async createUser(newUser: UserType): Promise<UserOutputType>{
        const result = await usersCollection.insertOne(newUser);
        return this._mapDBUserToUserOutputType(newUser)
    },
    async deleteUser(id: string): Promise<boolean>{
        const result = await usersCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },
    _mapDBUserToUserOutputType(user: UserType): UserOutputType{
        return{
            id:user.id,
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        }
    },
    async createUserAccount(newAccount: UserAccountDBType){
        const result = await usersAcountsCollection.insertOne(newAccount);
        return newAccount;
    },
}