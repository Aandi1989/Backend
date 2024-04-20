import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { myStatus, PostType } from "../../../posts/types/types";
import { ResultCode } from "src/common/types/types";
import { LikesRepository } from "src/features/likes/repo/like.repository";
import { LikesQueryRepo } from "src/features/likes/repo/like.query.repository";
import { PostsQueryRepo } from "../../../posts/repo/posts.query.repository";
import { LikePostStatus } from "../../entities/likePost.entity";

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
        const foundPost = await this.postsQueryRepo.getPostById(command.postId);
        if(!foundPost) return { code: ResultCode.NotFound };
        const foundStatus = await this.likesQueryRepo.getLikePost(command.postId, command.userId);
        if(!foundStatus){
            const newStatus = new LikePostStatus(command.userId, command.postId, command.status);
            const addedLike = await this.likesRepository.addLikePost(newStatus);
            return {code: ResultCode.Success}
        };
        if(foundStatus.status == command.status) return {code: ResultCode.Success}; 
        const updatedStatus = await this.likesRepository.updateLikePost(foundStatus.id, command.status)
        return {code: ResultCode.Success} 
    }
  }