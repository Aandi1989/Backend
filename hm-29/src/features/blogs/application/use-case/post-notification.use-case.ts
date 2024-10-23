import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { TelegramService } from "../../../../common/services/telegram-service";
import { BlogsQueryRepo } from "../../repo/blogs.query.repository";


export class PostNotificationCommand {
    constructor(public blogId: string,
                public blogName: string){}
}

@CommandHandler(PostNotificationCommand)
export class PostNotificationUseCase implements ICommandHandler<PostNotificationCommand>{
    constructor(protected blogsQueryRepo: BlogsQueryRepo,
                private telegramService: TelegramService,
    ){}

    async execute(command: PostNotificationCommand){
        const subscribers = await this.blogsQueryRepo.getBlogSubscribers(command.blogId);

        for(const user of subscribers){
            if(user.telegram_id){
                await this.telegramService.sendMessage(`New post published for blog ${command.blogName}.`, user.telegram_id)
            }
        }
    }
}