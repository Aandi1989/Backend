import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionOutputModel } from '../api/models/output/security.output.model';
import { Session } from '../domain/session.entity';


@Injectable()
export class SecurityQueryRepo {
    constructor(@InjectRepository(Session) private readonly sessionsRepository: Repository<Session>) { }

    async getSession(userId: string, deviceId: string, iat: string) {
        const result = await this.sessionsRepository.findOneBy({userId, deviceId, iat})
        return result;
    }
    async getSessionByDeviceId(deviceId: string) {
            const result = await this.sessionsRepository.findOneBy({deviceId});
            return result;
    }
    async getSessions(userId: string) {
        const result = await this.sessionsRepository.find({
            where: {userId}
        });
        return result.map(session => {
            return this._mapDBSessionTypeToOutputType(session)
        });
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
