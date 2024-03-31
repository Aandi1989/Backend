import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session } from '../domain/session.schema';
import { sessionType } from '../types/types';



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
}
