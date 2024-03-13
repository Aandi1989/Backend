import { jwtService } from "../application/jwt-service";
import { sessionsCollection } from "../db/db";
import { DBsessionType } from "../types/types";
import { HTTP_STATUSES } from "../utils";

export const securityQueryRepo = {
    async getSession(deviceId: string){
        const foundedSession = await sessionsCollection.findOne({deviceId});
        return foundedSession;
    },
    async getSessions(token: string){
        const tokenData = await jwtService.getRefreshTokenData(token)
        const sessions = await sessionsCollection.find({userId: tokenData.userId}).toArray();
        return sessions.map(session => {
            return this._mapDBSessionTypeToOutputType(session)
        });
    },
    _mapDBSessionTypeToOutputType(session: DBsessionType) {
        return {
            ip: session.ip,
            title: session.deviceName,
            lastActiveDate: session.iat,
            deviceId: session.deviceId
        }
    }
}
