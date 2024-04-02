import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { JwtService } from "src/common/services/jwt-service";
import { Result, ResultCode } from "src/common/types/types";
import { SecurityQueryRepo } from "../../repo/security.query.repository";



export class CheckSecurityRefreshTokenCommand {
    constructor(public token: string,
                public device_id?: string
                ){}
}

@CommandHandler(CheckSecurityRefreshTokenCommand)
export class CheckSecurityRefreshTokenUseCase implements ICommandHandler<CheckSecurityRefreshTokenCommand>{
    constructor(protected jwtService: JwtService,
                protected securityQueryRepo: SecurityQueryRepo){}

    async execute(command: CheckSecurityRefreshTokenCommand): Promise<Result> {
        const tokenData = await this.jwtService.getRefreshTokenData(command.token);
        const deviceId = command.device_id ? command.device_id : tokenData.deviceId;
        if(!tokenData.userId) return {code:ResultCode.Failed};
        const sessionExist = await this.securityQueryRepo.getSessionByDeviceId(deviceId);
        if(!sessionExist) return {code: ResultCode.NotFound};
        if(tokenData.message === 'jwt expired') return {code: ResultCode.Failed}
        if(tokenData.deviceId !== deviceId){
            const sessionFromCookie = await this.securityQueryRepo.getSessionByDeviceId(tokenData.deviceId);
            if(sessionFromCookie?.userId == sessionExist.userId) return {code: ResultCode.Success, data: tokenData};
            return {code:ResultCode.Forbidden};
        } 
        return {code: ResultCode.Success, data: tokenData}
    }
}