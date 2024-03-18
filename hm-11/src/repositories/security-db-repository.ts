import { sessionsModel } from "../db/models";

export class SecurityRepository {
    async revokeSession(deviceId: string){
        const result = await sessionsModel.deleteOne({deviceId});
        return result;
    }

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
    }
}
