import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BlogsRepository } from "../../repo/blogs.repository";


export class DeleteBlogCommand {
    constructor(public id: string){}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase implements ICommandHandler<DeleteBlogCommand>{
    constructor(protected blogsRepository: BlogsRepository){}

    async execute(command: DeleteBlogCommand): Promise<boolean> {
        return await this.blogsRepository.deleteBlog(command.id)
    }
}