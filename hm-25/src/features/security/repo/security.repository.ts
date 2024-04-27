import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshTokenDataModel } from '../api/models/input/refresh-token.input.model';
import { Session } from '../domain/session.entity';
import { SessionType } from '../types/types';



@Injectable()
export class SecurityRepository {
    constructor(@InjectRepository(Session) private readonly sessionsRepository: Repository<Session>) { }

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
        const result = await this.sessionsRepository
            .createQueryBuilder("session")
            .delete()
            .from("session")
            .where("userId = :userId AND deviceId != :deviceId", {userId, deviceId})
            .execute()
        return result;
    }
    async deleteAllData() {
        const result = await this.sessionsRepository
            .createQueryBuilder()
            .delete()
            .execute();
    }
}
