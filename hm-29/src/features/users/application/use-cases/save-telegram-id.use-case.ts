import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UsersRepository } from "../../repo/users.repository";

export class SaveUserTelegramIdCommand {
    constructor(public userId: string,
                public telegramId: number,
    ){}
}

@CommandHandler(SaveUserTelegramIdCommand)
export class SaveUserTelegramIdUseCase implements ICommandHandler<SaveUserTelegramIdCommand>{
    constructor(protected usersRepository: UsersRepository){}

    async execute(command: SaveUserTelegramIdCommand): Promise<boolean> {
        return await this.usersRepository.saveUserTelegramId(command.userId, command.telegramId);
    }
}