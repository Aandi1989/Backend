import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { JwtService } from "src/common/services/jwt-service";
import { Result, ResultCode } from "src/common/types/types";
import { SecurityQueryRepo } from "../../repo/security.query.repository";



export class CheckRefreshAfterDeleteSessionTokenCommand {
    constructor(public token: string){}
}

@CommandHandler(CheckRefreshAfterDeleteSessionTokenCommand)
export class CheckRefreshAfterDeleteSessionTokenUseCase implements ICommandHandler<CheckRefreshAfterDeleteSessionTokenCommand>{
    constructor(protected jwtService: JwtService,
                protected securityQueryRepo: SecurityQueryRepo){}

    async execute(command: CheckRefreshAfterDeleteSessionTokenCommand): Promise<Result> {
        const tokenData = await this.jwtService.getRefreshTokenData(command.token);
        if(!tokenData.userId) return {code:ResultCode.NotFound};
        // const tokenExist = await this.securityQueryRepo
        //     .getSession(tokenData.userId, tokenData.deviceId);
        // if(!tokenExist) return {code: ResultCode.Forbidden};
        // if(tokenData.message === 'jwt expired') return {code: ResultCode.Expired}
        return {code: ResultCode.Success,  data: tokenData}
    }
}