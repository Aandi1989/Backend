import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AuthQueryRepo } from "../../repo/auth.query.repo";
import { AuthRepository } from "../../repo/auth.repository";
import { codeDoesntExist, codeAlredyConfirmed, codeExpired } from "../../../../common/helpers/errorMessagesHelpers";
import { ResultCode } from "../../../../common/types/types";



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
        if(account.confCodeConfirmed) return {code: ResultCode.AlredyConfirmed, errorsMessages: codeAlredyConfirmed(command.code)};
        if(new Date (account!.confCodeExpDate!) < new Date()) return {code: ResultCode.Failed, errorsMessages: codeExpired(command.code)};
        return this.authRepository.confirmEmail(account.id)
    }
}