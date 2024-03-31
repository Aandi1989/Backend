import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session } from '../domain/session.schema';
import { sessionType } from '../types/types';
import { RefreshTokenDataModel } from '../api/models/input/refresh-token.input.model';



@Injectable()
export class SecurityRepository {
    constructor(
        @InjectModel(Session.name)
        private SessionModel: Model<Session>,
    ) { }

    async createSession(newSession: sessionType) {
        const result = await this.SessionModel.insertMany([newSession]);
        return result;
    }
    async revokeSession(tokenData: RefreshTokenDataModel) {
        const result = await this.SessionModel.deleteOne({ userId: tokenData.userId, deviceId: tokenData.deviceId });
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
}
