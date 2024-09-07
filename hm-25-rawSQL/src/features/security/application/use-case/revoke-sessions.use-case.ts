import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SecurityRepository } from "../../repo/security.repository";



export class RevokeSessionsCommand {
    constructor(public userId: string,
                public deviceId: string){}
}

@CommandHandler(RevokeSessionsCommand)
export class RevokeSessionsUseCase implements ICommandHandler<RevokeSessionsCommand>{
    constructor(protected securityRepository: SecurityRepository) { }
  
    async execute(command: RevokeSessionsCommand) {
        const revokedSession = await this.securityRepository.revokeSessions(command.userId, command.deviceId);
        return revokedSession;
    }
  }