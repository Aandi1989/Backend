import { jwtService } from "../application/jwt-service"
import { securityRepository } from "../repositories/security-db-repository";
import { securityQueryRepo } from "../repositories/securityQueryRepository";
import { Result, ResultCode } from "../types/types";

export const securityService = {
    async checkRefreshToken(token: string, deviceId: string): Promise<Result>{
        const tokenData = await jwtService.getRefreshTokenData(token);
        if(!tokenData.userId) return {code:ResultCode.Failed};
        const tokenExist = await securityQueryRepo.getSession(deviceId);
        if(!tokenExist) return {code: ResultCode.NotFound};
        if(tokenData.message === 'jwt expired') return {code: ResultCode.Failed}
        if(tokenData.deviceId !== deviceId) return {code:ResultCode.Forbidden};
        return {code: ResultCode.Success}
    },
    async deleteDevice(deviceId: string){
        const deletedDevice = await securityRepository.deleteDevice(deviceId);
        return deletedDevice;
    },
}
