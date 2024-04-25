import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import * as bcrypt from 'bcrypt';
import { AuthQueryRepo } from "../../repo/auth.query.repo";
import { accountExistError } from "../../../../common/helpers/errorMessagesHelpers";
import { emailManager } from "../../../../common/services/email-manager/email-manager";
import { Result, ResultCode } from "../../../../common/types/types";
import { CreateUserModel } from "../../../users/api/models/input/create-user.input.model";
import { Account } from "../../../users/entities/account";
import { UsersQueryRepo } from "../../../users/repo/users.query.repository";
import { UsersRepository } from "../../../users/repo/users.repository";



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
            let result = existedUser.email === email
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