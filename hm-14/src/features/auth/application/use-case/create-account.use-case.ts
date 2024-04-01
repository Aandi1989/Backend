import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UsersQueryRepo } from "src/features/users/repo/users.query.repository";
import { CreateUserModel } from "src/features/users/api/models/input/create-user.input.model";
import { Result, ResultCode } from "src/common/types/types";
import * as bcrypt from 'bcrypt';
import { Account } from "src/features/users/entities/account";
import { AuthQueryRepo } from "../../repo/auth.query.repo";
import { accountExistError } from "src/common/helpers/errorMessagesHelpers";
import { UsersRepository } from "src/features/users/repo/users.repository";
import { emailManager } from "src/common/services/email-manager/email-manager";



export class CreateAccountCommand {
    constructor(public data: CreateUserModel){}
}

@CommandHandler(CreateAccountCommand)
export class CreateAccountUseCase implements ICommandHandler<CreateAccountCommand>{
    constructor(protected usersQueryRepo: UsersQueryRepo,
                protected authQueryRepo: AuthQueryRepo,
                protected usersRepository: UsersRepository){}

    async execute(command: CreateAccountCommand): Promise<Result> {
        const {login, email, password} = command.data;

        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, passwordSalt);

        const newAccount = new Account (login, email, passwordHash, passwordSalt);

        const existedUser = await this.authQueryRepo.findByLoginOrEmail(email, login);
        if(existedUser) {
            let result = existedUser.accountData.email === email
            ?  {code: ResultCode.Forbidden, errorsMessages: accountExistError('email', email)}
            :  {code: ResultCode.Forbidden, errorsMessages: accountExistError('login', login)};
            return result;
        }
        
        const createdUser = await this.usersRepository.createUser(newAccount);
        try {
            // comented to avoid annoying messages during testing
            // await emailManager.sendConfirmationEmail(newAccount);
        } catch (error) {
            console.log(error)
            return {code: ResultCode.Failed};
        }
        return createdUser;
    }
}