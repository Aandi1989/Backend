import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session } from '../domain/session.schema';
import { SessionOutputModel } from '../api/models/output/security.output.model';
import { ApiCall } from 'src/features/auth/domain/apiCall.schema';
import { ApiCallModel } from '../api/models/input/api-call.input.model';


@Injectable()
export class SecurityQueryRepo {
    constructor(
        @InjectModel(Session.name) private SessionModel: Model<Session>,
        @InjectModel( ApiCall.name) private ApiCallModel: Model<ApiCall>,
    ) { }

    async getSession(userId: string, deviceId: string, iat: string) {
        const result = await this.SessionModel.findOne({ userId, deviceId, iat })
        return result;
    }
    async getSessionByDeviceId(deviceId: string){
        const result = await this.SessionModel.findOne({ deviceId })
        return result;
    }
    async getSessions(userId: string){
        const sessions = await this.SessionModel.find({userId}).lean();
        return sessions.map(session => {
            return this._mapDBSessionTypeToOutputType(session)
        });
    }
    async countRequests(request: ApiCallModel, currentDate: Date){
        const result = await this.ApiCallModel.countDocuments({
            ip: request.ip,
            url: request.url,
            date: { $gt: currentDate}
        });
        return result;
    }
    _mapDBSessionTypeToOutputType(session): SessionOutputModel {
        return {
            ip: session.ip,
            title: session.deviceName,
            lastActiveDate: session.iat,
            deviceId: session.deviceId
        }
    }
}
