import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session } from '../domain/session.schema';
import { sessionType } from '../types/types';
import { RefreshTokenDataModel } from '../api/models/input/refresh-token.input.model';
import { ApiCall } from 'src/features/auth/domain/apiCall.schema';
import { ApiCallModel } from '../api/models/input/api-call.input.model';



@Injectable()
export class SecurityRepository {
    constructor(
        @InjectModel(Session.name) private SessionModel: Model<Session>,
        @InjectModel( ApiCall.name) private ApiCallModel: Model<ApiCall>,
    ) { }

    async createSession(newSession: sessionType) {
        const result = await this.SessionModel.insertMany([newSession]);
        return result;
    }
    async revokeSession(deviceId: string):Promise<any> {
        const result = await this.SessionModel.deleteOne({deviceId});
        return result;
    }
    async updateSession(oldData:RefreshTokenDataModel, newData:RefreshTokenDataModel, ip:string){
        const oldIat = new Date (oldData.iat * 1000).toISOString();
        const newIat = new Date (newData.iat * 1000).toISOString();
        const newExp = new Date (newData.exp * 1000).toISOString();
        const result = await this.SessionModel.updateOne({userId: oldData.userId, deviceId: oldData.deviceId, iat: oldIat},
            { $set: {iat: newIat, exp: newExp, ip: ip }});
        return result;
    }
    async revokeSessions(userId: string, deviceId: string){
        const filter = { $and: [
            { userId: userId },
            { $or: [
                { deviceId: { $ne: deviceId }},
                { deviceId: { $exists: false }}
            ]}
        ]};
        const result = await this.SessionModel.deleteMany(filter);
        return result.deletedCount;
    }
    async addRequest(request: ApiCallModel){
        const result = await this.ApiCallModel.insertMany([request]);
        return result;
    }
    async deleteAllData() {
        await this.SessionModel.deleteMany({});
        await this.ApiCallModel.deleteMany({});
      }
}
