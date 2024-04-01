import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AuthQueryRepo } from "../../repo/auth.query.repo";
import { ResultCode } from "src/common/types/types";
import { codeAlredyConfirmed, codeDoesntExist, codeExpired } from "src/common/helpers/errorMessagesHelpers";
import { AuthRepository } from "../../repo/auth.repository";



export class ConfirmEmailCommand {
    constructor(public code: string){}
}

@CommandHandler(ConfirmEmailCommand)
export class ConfirmEmailUseCase implements ICommandHandler<ConfirmEmailCommand>{
    constructor(protected authQueryRepo: AuthQueryRepo,
                protected authRepository: AuthRepository){}

    async execute(command: ConfirmEmailCommand): Promise<any> {
        const account = await this.authQueryRepo.findByConfirmationCode(command.code);
        if(!account) return {code: ResultCode.Failed, errorsMessages: codeDoesntExist(command.code)};
        if(account.emailConfirmation.isConfirmed) return {code: ResultCode.AlredyConfirmed, errorsMessages: codeAlredyConfirmed(command.code)};
        if(account.emailConfirmation.expirationDate < new Date()) return {code: ResultCode.Failed, errorsMessages: codeExpired(command.code)};
        return this.authRepository.confirmEmail(account._id)
    }
}