import { BadRequestException, Injectable } from "@nestjs/common";
import { TelegramService } from "../../../../common/services/telegram-service";
import { TelegramUpdateMessage } from "../../../../common/types/types";
import { UsersQueryRepo } from "../../../users/repo/users.query.repository";
import { UsersRepository } from "../../../users/repo/users.repository";

@Injectable()
export class HandleTelegramUpdatesUseCase {
    constructor(private telegramService: TelegramService,
                private usersQueryRepo: UsersQueryRepo,
                private usersRepository: UsersRepository
    ){}
    async execute(payload: TelegramUpdateMessage){
        const messageText = payload.message.text;
        const idFromMessage = payload.message.from.id;

        if(messageText.startsWith('/start')){
            const activationCode = messageText.split(' ')[1];
            if (!activationCode) {
                throw new BadRequestException('Invalid activation code.');
            }
            
            const user = await this.usersQueryRepo.getUserByTelegramCode(activationCode);
            if(!user){
                return this.telegramService.sendMessage('Invalid activation code.', idFromMessage)
            };

            await this.usersRepository.saveUserTelegramId(user.id, idFromMessage);

            return this.telegramService.sendMessage('You have successfully activated the bot!', idFromMessage);
        }

        if(payload.message.text === 'сколько времени?'){
            this.telegramService.sendMessage(`${new Date()}`, payload.message.from.id);
        }else{
            this.telegramService.sendMessage('Cорри, я туповат.', payload.message.from.id);
        }
    }
}