import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CommentsQueryRepo } from "../../repo/comments.query.repository";
import { CommentsRepository } from "../../repo/comments.repository";
import { myStatus } from "../../types/types";
import { Result, ResultCode } from "../../../../common/types/types";
import { LikeStatus } from "../../../likes/entities/like";
import { LikesQueryRepo } from "../../../likes/repo/like.query.repository";
import { LikesRepository } from "../../../likes/repo/like.repository";


export class LikeCommentCommand {
    constructor(public id: string,
        public status: myStatus,
        public userId: string) { }
}

@CommandHandler(LikeCommentCommand)
export class LikeCommentUseCase implements ICommandHandler<LikeCommentCommand> {
    constructor(protected commentsQueryRepo: CommentsQueryRepo,
                protected commentsRepository: CommentsRepository,
                protected likesQueryRepo: LikesQueryRepo,
                protected likesRepository: LikesRepository) { }

    async execute(command: LikeCommentCommand): Promise<Result> {
        const foundComment = await this.commentsQueryRepo.getCommentById(command.id)
        if (!foundComment) return { code: ResultCode.NotFound };
        const foundStatus = await this.likesQueryRepo.getLikeComment(command.id, command.userId)
        if(foundStatus && foundStatus.status != command.status){
            const updatedStatus = this.likesRepository.updateLikeComment(foundStatus.id, command.status);
            return { code: ResultCode.Success }
        }
        if(!foundStatus){
            const newStatus = new LikeStatus(command.userId, command.id, command.status);
            const addedLike = await this.likesRepository.addLikeComment(newStatus);
            return {code: ResultCode.Success}
        }
        return {code: ResultCode.Success} 
    }
}