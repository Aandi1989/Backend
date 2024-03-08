import { inValidTokenCollection, usersAcountsCollection, validTokenCollection } from "../db/db";

export const authQueryRepo = {
    async findByConfirmationCode(code: string){
        const foundedAccount = await usersAcountsCollection.findOne({"emailConfirmation.confirmationCode": code});
        return foundedAccount;
    },
    async findByLoginOrEmail(email: string, login?: string){
        const foundedAccount = await usersAcountsCollection.findOne({ $or: [ { 'accountData.login': login }, 
                                                                        { 'accountData.email': email } ] });
        return foundedAccount;
    },
    async getInvalidToken(token: string){
        const result = await inValidTokenCollection.findOne({refreshToken: token})
        return result;
    },
    async getValidToken(token: string){
        const result = await validTokenCollection.findOne({refreshToken: token})
        return result?.refreshToken;
    }
}