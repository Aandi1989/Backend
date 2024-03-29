import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UsersRepository } from "../../repo/users.repository";

export class DeleteUserCommand {
    constructor(public id: string){}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase implements ICommandHandler<DeleteUserCommand>{
    constructor(protected usersRepository: UsersRepository){}

    async execute(command: DeleteUserCommand): Promise<boolean> {
        return await this.usersRepository.deleteUser(command.id);
    }
}