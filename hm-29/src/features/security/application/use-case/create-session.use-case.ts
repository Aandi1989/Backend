import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Session } from "../../types/types";
import { SecurityRepository } from "../../repo/security.repository";
import {v4 as uuidv4} from 'uuid';
import { JwtService } from "../../../../common/services/jwt-service";



export class CreateSessionCommand {
    constructor(public data: any){}
}

@CommandHandler(CreateSessionCommand)
export class CreateSessionUseCase implements ICommandHandler<CreateSessionCommand>{
    constructor(protected jwtService: JwtService,
                protected securityRepository: SecurityRepository) { }
  
    async execute(command: any): Promise<any> {
        const {userId, deviceId, iat, exp } = await this.jwtService.getRefreshTokenData(command.data.refreshToken);
        const newSession: Session = {
            id:  uuidv4(),
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