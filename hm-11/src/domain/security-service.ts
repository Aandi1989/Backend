import { JwtService } from "../application/jwt-service"
import { SecurityRepository } from "../repositories/security-db-repository";
import { SecurityQueryRepo } from "../repositories/securityQueryRepository";
import { Result, ResultCode } from "../types/types";

export class SecurityService {
    jwtService: JwtService;
    securityRepository: SecurityRepository;
    securityQueryRepo: SecurityQueryRepo;
    constructor(){
        this.jwtService = new JwtService(),
        this.securityRepository = new SecurityRepository(),
        this.securityQueryRepo = new SecurityQueryRepo()
    }
    async checkRefreshToken(token: string, device_id?: string): Promise<Result>{
        const tokenData = await this.jwtService.getRefreshTokenData(token);
        const deviceId = device_id ? device_id : tokenData.deviceId;
        if(!tokenData.userId) return {code:ResultCode.Failed};
        const sessionExist = await this.securityQueryRepo.getSession(deviceId);
        if(!sessionExist) return {code: ResultCode.NotFound};
        if(tokenData.message === 'jwt expired') return {code: ResultCode.Failed}
        if(tokenData.deviceId !== deviceId){
            const sessionFromCookie = await this.securityQueryRepo.getSession(tokenData.deviceId);
            if(sessionFromCookie?.userId == sessionExist.userId) return {code: ResultCode.Success};
            return {code:ResultCode.Forbidden};
        } 
        return {code: ResultCode.Success}
    }

    async revokeSession(deviceId: string){
        const revokedSession = await this.securityRepository.revokeSession(deviceId);
        return revokedSession;
    }

    async revokeSessions(token: string){
        const tokenData = await this.jwtService.getRefreshTokenData(token);
        const revokedSession = await this.securityRepository.revokeSessions(tokenData.userId, tokenData.deviceId);
        return revokedSession;
    }
}

