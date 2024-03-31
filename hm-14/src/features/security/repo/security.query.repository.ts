import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session } from '../domain/session.schema';


@Injectable()
export class SecurityQueryRepo {
    constructor(
        @InjectModel(Session.name)
        private SessionModel: Model<Session>,
    ) { }

    async getSession(userId: string, deviceId: string, iat: string) {
        const result = await this.SessionModel.findOne({ userId, deviceId, iat })
        return result;
    }
    
}
