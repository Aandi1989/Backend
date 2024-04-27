import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SecurityRepository } from "../../repo/security.repository";
import { JwtService } from "../../../../common/services/jwt-service";



export class RevokeSessionCommand {
    constructor(public id: string){}
}

@CommandHandler(RevokeSessionCommand)
export class RevokeSessionUseCase implements ICommandHandler<RevokeSessionCommand>{
    constructor(protected jwtService: JwtService,
                protected securityRepository: SecurityRepository) { }
  
    async execute(command: RevokeSessionCommand) {
        const revokedSession = await this.securityRepository.revokeSession(command.id);
        return revokedSession;
    }
  }