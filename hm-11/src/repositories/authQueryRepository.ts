import { apiCallsModel, sessionsModel, usersModel } from "../db/models";
import { User } from "../features/users/entities/user";
import { apiCallType } from "../types/types";

class AuthQueryRepo {
    async findByConfirmationCode(code: string): Promise<User | null>{
        const foundedAccount = await usersModel.findOne({"emailConfirmation.confirmationCode": code});
        return foundedAccount as User | null;
    }

    async findByLoginOrEmail(email: string, login?: string): Promise<User | null>{
        const foundedAccount = await usersModel.findOne({ $or: [ { 'accountData.login': login }, 
                                                                        { 'accountData.email': email } ] });
        return foundedAccount as User | null;
    }

    async findByRecoveryCode(recoveryCode: string): Promise<User | null>{
        const foundedAccount = await usersModel.findOne({'codeRecoveryInfo.recoveryCode': recoveryCode})
        return foundedAccount as User | null;
    }

    async countRequests(request: apiCallType, currentDate: Date){
        const result = await apiCallsModel.countDocuments({
            ip: request.ip,
            url: request.url,
            date: { $gt: currentDate}
        });
        return result;
    }

    async getSession(userId: string, deviceId: string, iat: string){
        const result = await sessionsModel.findOne({userId, deviceId, iat})
        return result;
    }
}

export const authQueryRepo = new AuthQueryRepo();