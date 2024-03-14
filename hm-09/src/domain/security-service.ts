import { jwtService } from "../application/jwt-service"
import { securityRepository } from "../repositories/security-db-repository";
import { securityQueryRepo } from "../repositories/securityQueryRepository";
import { Result, ResultCode } from "../types/types";

export const securityService = {
    async checkRefreshToken(token: string, device_id?: string): Promise<Result>{
        const tokenData = await jwtService.getRefreshTokenData(token);
        const deviceId = device_id ? device_id : tokenData.deviceId;
        if(!tokenData.userId) return {code:ResultCode.Failed};
        const tokenExist = await securityQueryRepo.getSession(deviceId);
        if(!tokenExist) return {code: ResultCode.NotFound};
        if(tokenData.message === 'jwt expired') return {code: ResultCode.Failed}
        if(tokenData.deviceId !== deviceId) return {code:ResultCode.Forbidden};
        return {code: ResultCode.Success}
    },
    async revokeSession(deviceId: string){
        const revokedSession = await securityRepository.revokeSession(deviceId);
        return revokedSession;
    },
    async revokeSessions(token: string){
        const tokenData = await jwtService.getRefreshTokenData(token);
        const revokedSession = await securityRepository.revokeSessions(tokenData.userId, tokenData.deviceId);
        return revokedSession;
    }
}
