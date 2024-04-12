import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AuthQueryRepo } from "../../repo/auth.query.repo";
import { ResultCode } from "src/common/types/types";
import {v4 as uuidv4} from 'uuid';
import { add } from 'date-fns/add';
import { AuthRepository } from "../../repo/auth.repository";
import { emailManager } from "src/common/services/email-manager/email-manager";



export class RecoveryCodeCommand {
    constructor(public email: string){}
}

@CommandHandler(RecoveryCodeCommand)
export class RecoveryCodeUseCase implements ICommandHandler<RecoveryCodeCommand>{
    constructor(protected authQueryRepo: AuthQueryRepo,
                protected authRepository: AuthRepository){}

    async execute(command: RecoveryCodeCommand): Promise<any> {
        const account = await this.authQueryRepo.findByLoginOrEmail(command.email)
        if(!account) return {code: ResultCode.NotFound};
        const newCodeData = {
            recoveryCode: uuidv4(),
            recCodeExpDate: add (new Date(), {
                hours:1,
                minutes: 3
            }).toISOString(),
            recCodeConfirmed: false
        };
        const updatedUser = await this.authRepository.updateCodeRecovery(account.id, newCodeData);
        try {
            // comented to avoid annoying messages during testing
            await emailManager.sendRecoveryCode(command.email, newCodeData.recoveryCode)
        } catch (error) {
            console.log(error)
            return {code: ResultCode.Failed};
        }
        return {code: ResultCode.Success};
    }
}