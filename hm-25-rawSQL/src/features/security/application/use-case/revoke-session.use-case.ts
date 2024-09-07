import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { JwtService } from "src/common/services/jwt-service";
import { SecurityRepository } from "../../repo/security.repository";



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