import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AuthQueryRepo } from "../../repo/auth.query.repo";
import { ResultCode } from "src/common/types/types";
import { AuthRepository } from "../../repo/auth.repository";
import { emailManager } from "src/common/services/email-manager/email-manager";
import * as bcrypt from "bcrypt";
import { recoveryCodeDoesntExist } from "src/common/helpers/errorMessagesHelpers";
import { ChangePasswordModel } from "../../api/models/input/change.password.model";



export class ChangeCodeCommand {
    constructor(public body: ChangePasswordModel){}
}

@CommandHandler(ChangeCodeCommand)
export class ChangeCodeUseCase implements ICommandHandler<ChangeCodeCommand>{
    constructor(protected authQueryRepo: AuthQueryRepo,
                protected authRepository: AuthRepository){}

    async execute(command: ChangeCodeCommand): Promise<any> {
        const account = await this.authQueryRepo.findByRecoveryCode(command.body.recoveryCode);
        if(!account) return {code: ResultCode.NotFound, errorsMessages: recoveryCodeDoesntExist(command.body.recoveryCode)};
        if( new Date() > new Date (account!.recCodeExpDate!) ) return {code: ResultCode.Expired};
        if(account.recCodeConfirmed) return {code: ResultCode.Forbidden};

        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(command.body.newPassword, passwordSalt);
        const updatedUser = await this.authRepository.changePassword(account.id, passwordSalt, passwordHash);
        return {code: ResultCode.Success};
    }
}