import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BlogsRepository } from "../../repo/blogs.repository";
import { UserOutputModel } from "../../../users/api/models/output/user.output.model";
import { Result, ResultCode } from "../../../../common/types/types";
import { BlogsQueryRepo } from "../../repo/blogs.query.repository";


export class DeleteOwnBlogCommand {
    constructor(public blogId: string,
                public user: UserOutputModel){}
}

@CommandHandler(DeleteOwnBlogCommand)
export class DeleteOwnBlogUseCase implements ICommandHandler<DeleteOwnBlogCommand>{
    constructor(protected blogsRepository: BlogsRepository,
                protected blogsQueryRepo: BlogsQueryRepo){}

    async execute(command: DeleteOwnBlogCommand): Promise<Result> {
        const blog = await this.blogsQueryRepo.findBlogById(command.blogId);    

        if(!blog) return {code: ResultCode.NotFound};

        if(blog.ownerId != command.user.id) return {code: ResultCode.Forbidden};

        const isDeleted = await this.blogsRepository.deleteBlog(command.blogId);

        if(isDeleted){ 
            return {code: ResultCode.Success}
        }else{
            return {code: ResultCode.Failed}   
        } 
    }
}