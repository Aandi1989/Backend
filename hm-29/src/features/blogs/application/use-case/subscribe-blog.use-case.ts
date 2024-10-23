import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BlogsRepository } from "../../repo/blogs.repository";


export class SubscribeBlogCommand {
    constructor(public userId: string,
                public blogId: string
    ){}
}

@CommandHandler(SubscribeBlogCommand)
export class SubscribeBlogUseCase implements ICommandHandler<SubscribeBlogCommand>{
    constructor(protected blogsRepository: BlogsRepository){}

    async execute(command: SubscribeBlogCommand): Promise<boolean> {
        return await this.blogsRepository.subscribeBlog(command.userId, command.blogId);
    }
}