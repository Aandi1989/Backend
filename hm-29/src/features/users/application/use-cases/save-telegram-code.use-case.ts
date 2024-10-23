import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UsersRepository } from "../../repo/users.repository";

export class SaveTelegramCodeCommand {
    constructor(public userId: string,
                public code: string,
    ){}
}

@CommandHandler(SaveTelegramCodeCommand)
export class SaveTelegramCodeUseCase implements ICommandHandler<SaveTelegramCodeCommand>{
    constructor(protected usersRepository: UsersRepository){}

    async execute(command: SaveTelegramCodeCommand): Promise<boolean> {
        return await this.usersRepository.saveTelegramActivationCode(command.userId, command.code);
    }
}