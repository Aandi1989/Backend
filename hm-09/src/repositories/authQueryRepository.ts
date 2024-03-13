import { apiCallsCollection, inValidTokenCollection, usersAcountsCollection } from "../db/db";
import { apiCallType } from "../types/types";

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
    async countRequests(request: apiCallType, currentDate: Date){
        const result = await apiCallsCollection.countDocuments({
            ip: request.ip,
            url: request.url,
            date: { $gt: currentDate}
        });
        return result;
        
    }
}