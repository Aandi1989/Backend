import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session } from '../domain/session.schema';
import { SessionSQL, sessionType } from '../types/types';
import { RefreshTokenDataModel } from '../api/models/input/refresh-token.input.model';
import { ApiCall } from 'src/features/auth/domain/apiCall.schema';
import { ApiCallModel } from '../api/models/input/api-call.input.model';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';



@Injectable()
export class SecurityRepository {
    constructor(
        @InjectModel(Session.name) private SessionModel: Model<Session>,
        @InjectModel( ApiCall.name) private ApiCallModel: Model<ApiCall>,
        @InjectDataSource() protected dataSourse: DataSource
    ) { }

    async createSession(newSession: SessionSQL) {
        const { id, userId, deviceId, iat, deviceName, ip, exp } = newSession;
        const query = `
            INSERT INTO public."Sessions"(
                "id", "userId", "deviceId", "iat", "deviceName", "ip", "exp")
                VALUES ('${id}', '${userId}', '${deviceId}', '${iat}', '${deviceName}', '${ip}', '${exp}');
        `;
        const result = await this.dataSourse.query(query);
        return result;
    }
    async revokeSession(deviceId: string):Promise<any> {
        const query = 
            `DELETE FROM public."Sessions"
            WHERE "deviceId" = '${deviceId}'`;
        const result = await this.dataSourse.query(query);
        return result[1] === 1;
    }
    async updateSession(oldData:RefreshTokenDataModel, newData:RefreshTokenDataModel, ip:string){
        const oldIat = new Date (oldData.iat * 1000).toISOString();
        const newIat = new Date (newData.iat * 1000).toISOString();
        const newExp = new Date (newData.exp * 1000).toISOString();
        const { deviceId, userId } = oldData; 
        const query = `
            UPDATE public."Sessions" 
            SET "iat" = '${newIat}', "exp" = '${newExp}', "ip" = '${ip}'
            WHERE "userId" = '${userId}' AND "deviceId" = '${deviceId}' AND "iat" = '${oldIat}' 
        `;
        const result = await this.dataSourse.query(query);
        return result[1] === 1;
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
        const { ip, url, date } = request;
        const query = `
            INSERT INTO public."ApiCalls"(
                "ip", "url", "date" )
                VALUES ('${ip}', '${url}', '${date}');
        `;
        const result = await this.dataSourse.query(query);
        return result;
    }
    async deleteAllData() {
        const sessionQuery = `DELETE FROM public."Sessions"`;
        const result = await this.dataSourse.query(sessionQuery);
        const apiCallQuery = `DELETE FROM public."ApiCalls"`;
        const secondResult = await this.dataSourse.query(apiCallQuery);
      }
}
