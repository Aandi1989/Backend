import { apiCallsModel, sessionsModel, usersModel } from "../db/models";
import { apiCallType } from "../types/types";

export const authQueryRepo = {
    async findByConfirmationCode(code: string){
        const foundedAccount = await usersModel.findOne({"emailConfirmation.confirmationCode": code});
        return foundedAccount;
    },
    async findByLoginOrEmail(email: string, login?: string){
        const foundedAccount = await usersModel.findOne({ $or: [ { 'accountData.login': login }, 
                                                                        { 'accountData.email': email } ] });
        return foundedAccount;
    },
    async findByRecoveryCode(recoveryCode: string){
        const foundedAccount = await usersModel.findOne({'codeRecoveryInfo.recoveryCode': recoveryCode})
        return foundedAccount;
    },
    async countRequests(request: apiCallType, currentDate: Date){
        const result = await apiCallsModel.countDocuments({
            ip: request.ip,
            url: request.url,
            date: { $gt: currentDate}
        });
        return result;
    },
    async getSession(userId: string, deviceId: string, iat: string){
        const result = await sessionsModel.findOne({userId, deviceId, iat})
        return result;
    },
}