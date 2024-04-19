import { Injectable } from '@nestjs/common';
import { SessionOutputModel } from '../api/models/output/security.output.model';
import { ApiCallModel } from '../api/models/input/api-call.input.model';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Session } from '../domain/session.entity';


@Injectable()
export class SecurityQueryRepo {
    constructor(@InjectDataSource() protected dataSourse: DataSource,
                @InjectRepository(Session) private readonly sessionsRepository: Repository<Session>) { }

    async getSession(userId: string, deviceId: string, iat: string) {
        const result = await this.sessionsRepository.findOneBy({userId, deviceId, iat})
        return result;
    }
    async getSessionByDeviceId(deviceId: string) {
        const query =
            `SELECT * 
                FROM public."Sessions"
                WHERE "deviceId" = '${deviceId}'`;
        const result = await this.dataSourse.query(query);
        return result[0];
    }
    async getSessions(userId: string) {
        const query =
        `SELECT * 
            FROM public."Sessions"
            WHERE "userId" = '${userId}'`;
        const result = await this.dataSourse.query(query);
        return result.map(session => {
                    return this._mapDBSessionTypeToOutputType(session)
        });
    }
    async countRequests(request: ApiCallModel, currentDate: string) {
        const { ip, url, date } = request;
        const query = `
            SELECT COUNT(*)
            FROM public."ApiCalls"
            WHERE
                "ip" = '${ip}'
                AND "url" = '${url}'
                AND "date" > '${currentDate}'
        `;
        const result = await this.dataSourse.query(query);
        return result[0].count;
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
