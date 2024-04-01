import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AuthBodyModel } from "../../api/models/input/login.input.model";
import { AuthQueryRepo } from "../../repo/auth.query.repo";
import { ResultCode } from "src/common/types/types";
import {v4 as uuidv4} from 'uuid';
import { AuthRepository } from "../../repo/auth.repository";
import { emailAlredyConfirmed, emailDoesntExist } from "src/common/helpers/errorMessagesHelpers";
import { emailManager } from "src/common/services/email-manager/email-manager";



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
        if(account.emailConfirmation.isConfirmed) return {code: ResultCode.Failed, errorsMessages: emailAlredyConfirmed(command.email)};
        const newConfirmationCode = uuidv4();
        const updatedAccountData = await this.authRepository.updateConfirmationCode(account._id, newConfirmationCode);
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