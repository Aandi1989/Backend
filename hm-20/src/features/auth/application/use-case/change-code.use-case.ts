import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AuthQueryRepo } from "../../repo/auth.query.repo";
import { AuthRepository } from "../../repo/auth.repository";
import * as bcrypt from "bcrypt";
import { ChangePasswordModel } from "../../api/models/input/change.password.model";
import { recoveryCodeDoesntExist } from "../../../../common/helpers/errorMessagesHelpers";
import { ResultCode } from "../../../../common/types/types";



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