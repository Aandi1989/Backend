import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { v4 as uuidv4 } from 'uuid';
import { emailAlredyConfirmed, emailDoesntExist } from "../../../../common/helpers/errorMessagesHelpers";
import { emailManager } from "../../../../common/services/email-manager/email-manager";
import { ResultCode } from "../../../../common/types/types";
import { AuthQueryRepo } from "../../repo/auth.query.repo";
import { AuthRepository } from "../../repo/auth.repository";



export class ResendEmailCommand {
    constructor(public email: string){}
}

@CommandHandler(ResendEmailCommand)
export class ResendEmailUseCase implements ICommandHandler<ResendEmailCommand>{
    constructor(protected authQueryRepo: AuthQueryRepo,
                protected authRepository: AuthRepository){}

    async execute(command: ResendEmailCommand): Promise<any> {
        const account = await this.authQueryRepo.findByLoginOrEmail(command.email)
        if(!account) return {code: ResultCode.Failed, errorsMessages: emailDoesntExist(command.email)};
        if(account.confCodeConfirmed) return {code: ResultCode.Failed, errorsMessages: emailAlredyConfirmed(command.email)};
        const newConfirmationCode = uuidv4();
        const updatedAccountData = await this.authRepository.updateConfirmationCode(account.id, newConfirmationCode);
        try {
            // comented to avoid annoying messages during testing
            // await emailManager.resendConfirmationalEmail(command.email, newConfirmationCode)
        } catch (error) {
            console.log(error)
            return {code: ResultCode.Failed};
        }
        return updatedAccountData;
    }
}