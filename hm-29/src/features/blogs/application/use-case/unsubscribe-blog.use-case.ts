import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BlogsRepository } from "../../repo/blogs.repository";


export class UnsubscribeBlogCommand {
    constructor(public userId: string,
                public blogId: string
    ){}
}

@CommandHandler(UnsubscribeBlogCommand)
export class UnsubscribeBlogUseCase implements ICommandHandler<UnsubscribeBlogCommand>{
    constructor(protected blogsRepository: BlogsRepository){}

    async execute(command: UnsubscribeBlogCommand): Promise<boolean> {
        return await this.blogsRepository.unsubscribeBlog(command.userId, command.blogId);
    }
}