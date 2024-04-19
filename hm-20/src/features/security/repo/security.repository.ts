import { Injectable } from '@nestjs/common';
import { SessionType } from '../types/types';
import { RefreshTokenDataModel } from '../api/models/input/refresh-token.input.model';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Session } from '../domain/session.entity';



@Injectable()
export class SecurityRepository {
    constructor(@InjectDataSource() protected dataSourse: DataSource,
                @InjectRepository(Session) private readonly sessionsRepository: Repository<Session>) { }

    async createSession(newSession: SessionType) {
        const result = await this.sessionsRepository.save(newSession);
        return result;
    }
    async revokeSession(deviceId: string):Promise<any> {
       const result = await this.sessionsRepository.delete({deviceId: deviceId});
       return result.affected === 1;
    }
    async updateSession(oldData:RefreshTokenDataModel, newData:RefreshTokenDataModel, ip:string){
        const oldIat = new Date (oldData.iat * 1000).toISOString();
        const newIat = new Date (newData.iat * 1000).toISOString();
        const newExp = new Date (newData.exp * 1000).toISOString();
        const { deviceId, userId } = oldData; 
        const result = await this.sessionsRepository.update(
            {userId, deviceId, iat: oldIat}, 
            {iat: newIat, exp: newExp, ip: ip} 
        );
        return result.affected === 1;
    }
    async revokeSessions(userId: string, deviceId: string){
        const query = `
        DELETE FROM public."Sessions"
        WHERE "userId" = '${userId}'
        AND "deviceId" != '${deviceId}'
   `;
   const result = await this.dataSourse.query(query);
   return result;
    }
    async deleteAllData() {
        const result = await this.sessionsRepository.clear();
    }
}
