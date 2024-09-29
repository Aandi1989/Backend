import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UserOutputModel } from "../../../users/api/models/output/user.output.model";
import { BlogsQueryRepo } from "../../repo/blogs.query.repository";
import { Result, ResultCode } from "../../../../common/types/types";
import { PostsQueryRepo } from "../../../posts/repo/posts.query.repository";
import { PostsRepository } from "../../../posts/repo/posts.repository";


export class DeleteOwnPostCommand {
    constructor(public blogId: string,
                public postId: string,
                public user: UserOutputModel){}
}

@CommandHandler(DeleteOwnPostCommand)
export class DeleteOwnPostUseCase implements ICommandHandler<DeleteOwnPostCommand>{
    constructor(protected blogsQueryRepo: BlogsQueryRepo,
                protected postsQueryRepo: PostsQueryRepo,
                protected postsRepository: PostsRepository
    ) { }
  
    async execute(command: DeleteOwnPostCommand): Promise<Result> {
        const post = await this.postsQueryRepo.getPostById(command.postId);
        const blog = await this.blogsQueryRepo.findBlogById(command.blogId);

        if(!blog || !post) return {code: ResultCode.NotFound};

        if(post.blogId != command.blogId || blog.ownerId != command.user.id) return {code: ResultCode.Forbidden};

        const isDeleted = await this.postsRepository.deletePost(command.postId);

        if(isDeleted){ 
            return {code: ResultCode.Success}
        }else{
            return {code: ResultCode.Failed}   
        } 
    }
  }