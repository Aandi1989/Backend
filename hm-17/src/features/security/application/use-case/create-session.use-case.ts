import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateSessionModel } from "../../api/models/input/create-session.input.model";
import { JwtService } from "src/common/services/jwt-service";
import { sessionType } from "../../types/types";
import { SecurityRepository } from "../../repo/security.repository";



export class CreateSessionCommand {
    constructor(public data: any){}
}

@CommandHandler(CreateSessionCommand)
export class CreateSessionUseCase implements ICommandHandler<CreateSessionCommand>{
    constructor(protected jwtService: JwtService,
                protected securityRepository: SecurityRepository) { }
  
    async execute(command: any): Promise<any> {
        const {userId, deviceId, iat, exp } = await this.jwtService.getRefreshTokenData(command.data.refreshToken);
        const newSession: sessionType = {
            userId,
            deviceId,
            iat: new Date(iat * 1000).toISOString(),
            deviceName: command.data.deviceName ? command.data.deviceName : 'unknown',
            ip: command.data.ip,
            exp: new Date(exp * 1000).toISOString()
        }
        const createdSession = await this.securityRepository.createSession(newSession);
        return createdSession;
    }
  }