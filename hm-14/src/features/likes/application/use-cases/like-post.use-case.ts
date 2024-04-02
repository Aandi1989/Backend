import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { myStatus, PostType } from "../../../posts/types/types";
import { ResultCode } from "src/common/types/types";
import { LikeStatus } from "src/features/likes/entities/like";
import { LikesRepository } from "src/features/likes/repo/like.repository";
import { LikesQueryRepo } from "src/features/likes/repo/like.query.repository";
import { PostsQueryRepo } from "../../../posts/repo/posts.query.repository";

export class LikePostCommand {
    constructor(public postId: string,
                public status: myStatus,
                public userId: string){}
}

@CommandHandler(LikePostCommand)
export class LikePostUseCase implements ICommandHandler<LikePostCommand>{
    constructor(protected likesRepository: LikesRepository,
                protected postsQueryRepo: PostsQueryRepo,
                protected likesQueryRepo: LikesQueryRepo) { }
  
    async execute(command: LikePostCommand): Promise<any> {
        const foundPost = await this.postsQueryRepo.getPostById(command.postId, command.userId);
        if(!foundPost) return { code: ResultCode.NotFound };
        const foundStatus = await this.likesQueryRepo.getLike(command.postId, command.userId);
        if(!foundStatus){
            const newStatus = new LikeStatus(command.userId, command.postId, command.status);
            const addedLike = await this.likesRepository.addLike(newStatus);
            return {code: ResultCode.Success}
        };
        foundStatus.status = command.status;
        await foundStatus.save()
        return {code: ResultCode.Success} 
    }
  }