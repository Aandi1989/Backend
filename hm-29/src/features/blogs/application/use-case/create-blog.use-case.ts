import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateBlogModel } from "../../api/models/input/create-blog.input.model";
import { BlogsRepository } from "../../repo/blogs.repository";
import { BlogType } from "../../types/types";
import {v4 as uuidv4} from 'uuid';
import { UserOutputModel } from "../../../users/api/models/output/user.output.model";
import { blogCreatedWithImages } from "../../../../common/helpers/blogMappers";


export class CreateBlogCommand {
    constructor(public data: CreateBlogModel,
                public user?: UserOutputModel){}
}

@CommandHandler(CreateBlogCommand)
export class CreateblogUseCase implements ICommandHandler<CreateBlogCommand>{
    constructor(protected blogsRepository: BlogsRepository) { }
  
    async execute(command: CreateBlogCommand): Promise<BlogType> {
        let createBlogOutputModel;
        const newBlog = {
            id: uuidv4(),
            name: command.data.name,
            description: command.data.description,
            websiteUrl: command.data.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false,
            ownerId: command.user?.id ? command.user?.id : undefined
        };
        const createdBlog = await this.blogsRepository.createBlog(newBlog)
        
        if(createdBlog){
            createBlogOutputModel = blogCreatedWithImages(createdBlog);
        }

        return createBlogOutputModel;
    }
  }