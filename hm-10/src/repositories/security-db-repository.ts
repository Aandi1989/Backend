import { sessionsCollection } from "../db/db"

export const securityRepository = {
    async revokeSession(deviceId: string){
        const result = await sessionsCollection.deleteOne({deviceId});
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
        const result = await sessionsCollection.deleteMany(filter);
        return result.deletedCount;
    },
}