// import { sessionsCollection } from "../db/db"

import { sessionsModel } from "../db/models";

export const securityRepository = {
    async revokeSession(deviceId: string){
        const result = await sessionsModel.deleteOne({deviceId});
        return result;
    },
    async revokeSessions(userId: string, deviceId: string){
        const filter = { $and: [
            { userId: userId },
            { $or: [
                { deviceId: { $ne: deviceId }},
                { deviceId: { $exists: false }}
            ]}
        ]};
        const result = await sessionsModel.deleteMany(filter);
        return result.deletedCount;
    },
}