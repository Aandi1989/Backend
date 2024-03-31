import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AuthBodyModel } from "../../api/models/input/login.input.model";
import { UsersQueryRepo } from "src/features/users/repo/users.query.repository";
import * as bcrypt from 'bcrypt';



export class CheckCredentialsCommand {
    constructor(public data: AuthBodyModel){}
}

@CommandHandler(CheckCredentialsCommand)
export class CheckCredentialsUseCase implements ICommandHandler<CheckCredentialsCommand>{
    constructor(protected usersQueryRepo: UsersQueryRepo){}

    async execute(command: CheckCredentialsCommand): Promise<any> {
        const user = await this.usersQueryRepo.getByLoginOrEmail(command.data.loginOrEmail);
        if(!user) return false;
        const passwordHash = await bcrypt.hash(command.data.password, user.accountData.passwordSalt);
        if(user.accountData.passwordHash !== passwordHash) return false;
        return user;
    }
}