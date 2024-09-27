import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { JwtService } from "../../../../common/services/jwt-service";
import { SecurityRepository } from "../../../security/repo/security.repository";





export class RefreshTokensCommand {
    constructor(public token: string,
                public ip: string){}
}

@CommandHandler(RefreshTokensCommand)
export class RefreshTokensUseCase implements ICommandHandler<RefreshTokensCommand>{
    constructor(protected jwtService: JwtService,
                protected securityRepository: SecurityRepository) { }
  
    async execute(command: RefreshTokensCommand) {
        const tokenData = await this.jwtService.getRefreshTokenData(command.token);
        const newAccessToken = await this.jwtService.createAccessToken(tokenData.userId);
        const newRefreshToken = await this.jwtService.createRefreshToken(tokenData.userId, tokenData.deviceId);
        const newTokenData = await this.jwtService.getRefreshTokenData(newRefreshToken.refreshToken)
        const updatedSession = await this.securityRepository
            .updateSession(tokenData, newTokenData, command.ip);
        return {newAccessToken, newRefreshToken}
    }
  }