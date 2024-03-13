import { sessionsCollection } from "../db/db"

export const securityRepository = {
    async deleteDevice(deviceId: string){
        const result = await sessionsCollection.deleteOne({deviceId});
        return result;
    }
}