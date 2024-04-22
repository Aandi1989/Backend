import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Result, ResultCode } from "src/common/types/types";
import { PostsQueryRepo } from "../../repo/posts.query.repository";
import { PostsRepository } from "../../repo/posts.repository";

export class CheckPostCommand {
    constructor(public blogId: string,
                public postId: string){}
}

@CommandHandler(CheckPostCommand)
export class CheckPostUseCase implements ICommandHandler<CheckPostCommand>{
    constructor(protected postsRepository: PostsRepository,
                protected postsQueryRepo: PostsQueryRepo
    ) { }
  
    async execute(command: CheckPostCommand): Promise<Result> {
        const foundedPost = await this.postsQueryRepo.getPostWithoutLikesByBlogIdAndPostId(command.blogId, command.postId);
        if(!foundedPost) return { code: ResultCode.NotFound};
        // if(foundedPost.userIdFromBlog !== foundedPost.userIdFromUser){
        //     return { code: ResultCode.Forbidden }
        // }
        return {code: ResultCode.Success}
    }
  }