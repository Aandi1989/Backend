import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SecurityQueryRepo } from "../../repo/security.query.repository";
import { JwtService } from "../../../../common/services/jwt-service";
import { Result, ResultCode } from "../../../../common/types/types";



export class CheckRefreshTokenCommand {
    constructor(public token: string){}
}

@CommandHandler(CheckRefreshTokenCommand)
export class CheckRefreshTokenUseCase implements ICommandHandler<CheckRefreshTokenCommand>{
    constructor(protected jwtService: JwtService,
                protected securityQueryRepo: SecurityQueryRepo){}

    async execute(command: CheckRefreshTokenCommand): Promise<Result> {
        const tokenData = await this.jwtService.getRefreshTokenData(command.token);
        if(!tokenData.userId) return {code:ResultCode.NotFound};
        const tokenExist = await this.securityQueryRepo
            .getSession(tokenData.userId, tokenData.deviceId, new Date(tokenData.iat*1000).toISOString());
        if(!tokenExist) return {code: ResultCode.Forbidden};
        if(tokenData.message === 'jwt expired') return {code: ResultCode.Expired}
        return {code: ResultCode.Success, data:tokenData}
    }
}