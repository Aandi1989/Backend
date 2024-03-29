import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateBlogModel } from "../../api/models/input/create-blog.input.model";
import { BlogsRepository } from "../../repo/blogs.repository";
import { BlogType } from "../../types/types";


export class CreateBlogCommand {
    constructor(public data: CreateBlogModel){}
}

@CommandHandler(CreateBlogCommand)
export class CreateblogUseCase implements ICommandHandler<CreateBlogCommand>{
    constructor(protected blogsRepository: BlogsRepository) { }
  
    async execute(command: CreateBlogCommand): Promise<BlogType> {
        const newBlog = {
            id: (+new Date()).toString(),
            name: command.data.name,
            description: command.data.description,
            websiteUrl: command.data.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        };
        const createdBlog = await this.blogsRepository.createBlog(newBlog)
        return createdBlog;
    }
  }