import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UserOutputModel } from "../../../users/api/models/output/user.output.model";
import { BlogsQueryRepo } from "../../repo/blogs.query.repository";
import { Result, ResultCode } from "../../../../common/types/types";
import { UpdatePostForBlogModel } from "../../api/models/input/update-post.input";
import { PostsQueryRepo } from "../../../posts/repo/posts.query.repository";
import { PostsRepository } from "../../../posts/repo/posts.repository";


export class UpdateOwnPostCommand {
    constructor(public blogId: string,
                public postId: string,
                public body: UpdatePostForBlogModel,
                public user: UserOutputModel){}
}

@CommandHandler(UpdateOwnPostCommand)
export class UpdateOwnPostUseCase implements ICommandHandler<UpdateOwnPostCommand>{
    constructor(protected blogsQueryRepo: BlogsQueryRepo,
                protected postsQueryRepo: PostsQueryRepo,
                protected postsRepository: PostsRepository
    ) { }
  
    async execute(command: UpdateOwnPostCommand): Promise<Result> {
        const post = await this.postsQueryRepo.getPostById(command.postId);
        const blog = await this.blogsQueryRepo.findBlogById(command.blogId);

        if(!blog || !post) return {code: ResultCode.NotFound};

        if(post.blogId != command.blogId || blog.ownerId != command.user.id) return {code: ResultCode.Forbidden};

        const isUpdated = await this.postsRepository.updatePost(command.postId, command.body);

        if(isUpdated){ 
            return {code: ResultCode.Success}
        }else{
            return {code: ResultCode.Failed}   
        } 
    }
  }