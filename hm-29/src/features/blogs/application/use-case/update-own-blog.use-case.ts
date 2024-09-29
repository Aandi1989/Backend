import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateBlogModel } from "../../api/models/input/create-blog.input.model";
import { BlogsRepository } from "../../repo/blogs.repository";
import { UserOutputModel } from "../../../users/api/models/output/user.output.model";
import { BlogsQueryRepo } from "../../repo/blogs.query.repository";
import { Result, ResultCode } from "../../../../common/types/types";


export class UpdateOwnBlogCommand {
    constructor(public blogId: string,
                public data: CreateBlogModel,
                public user: UserOutputModel){}
}

@CommandHandler(UpdateOwnBlogCommand)
export class UpdateOwnBlogUseCase implements ICommandHandler<UpdateOwnBlogCommand>{
    constructor(protected blogsRepository: BlogsRepository,
                protected blogsQueryRepo: BlogsQueryRepo) { }
  
    async execute(command: UpdateOwnBlogCommand): Promise<Result> {
        const blog = await this.blogsQueryRepo.findBlogById(command.blogId);    

        if(!blog) return {code: ResultCode.NotFound};

        if(blog.ownerId != command.user.id) return {code: ResultCode.Forbidden};

        const isUpdated = await this.blogsRepository.updateBlog(command.blogId, command.data);
        
        if(isUpdated){ 
            return {code: ResultCode.Success}
        }else{
            return {code: ResultCode.Failed}   
        } 
    }
  }