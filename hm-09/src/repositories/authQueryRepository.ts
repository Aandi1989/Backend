import { apiCallsCollection, sessionsCollection, usersAcountsCollection } from "../db/db";
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
    async countRequests(request: apiCallType, currentDate: Date){
        const result = await apiCallsCollection.countDocuments({
            ip: request.ip,
            url: request.url,
            date: { $gt: currentDate}
        });
        return result;
    },
    async getSession(userId: string, deviceId: string, iat: string){
        const result = await sessionsCollection.findOne({userId, deviceId, iat})
        return result;
    },
}