import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CommentsQueryRepo } from "../../repo/comments.query.repository";
import { ResultCode } from "src/common/types/types";
import { CommentsRepository } from "../../repo/comments.repository";
import { Like, myStatus } from "../../types/types";
import { setStatus } from "src/common/helpers/getCommentStatus";


export class LikeCommentCommand {
    constructor(public id: string,
        public status: myStatus,
        public userId: string) { }
}

@CommandHandler(LikeCommentCommand)
export class LikeCommentUseCase implements ICommandHandler<LikeCommentCommand> {
    constructor(protected commentsQueryRepo: CommentsQueryRepo,
                protected commentsRepository: CommentsRepository) { }

    async execute(command: LikeCommentCommand): Promise<any> {
        const foundComment = await this.commentsQueryRepo.getDBTypeCommentById(command.id)
        if (!foundComment) return { code: ResultCode.NotFound };
        const statusObj = setStatus(foundComment, command.status, command.userId);
        if (!statusObj) return { code: ResultCode.Success };
        const newStatus: Like = {
            id: (+new Date()).toString(),
            status: command.status,
            userId: command.userId,
            parentId: command.id,
            createdAt: new Date().toISOString()
        }
        if (foundComment) {
            foundComment.likes = statusObj.like === 'add' ? [newStatus, ...foundComment.likes] : foundComment.likes;
            foundComment.likes = statusObj.like === 'remove' ? foundComment.likes.filter(like => like.userId != command.userId) : foundComment.likes;
            foundComment.dislikes = statusObj.dislike === 'add' ? [newStatus, ...foundComment.dislikes] : foundComment.dislikes;
            foundComment.dislikes = statusObj.dislike === 'remove' ? foundComment.dislikes.filter(dislike => dislike.userId != command.userId) : foundComment.dislikes;
            //@ts-ignore
            await foundComment.save()
        }
        return { code: ResultCode.Success }
    }
}