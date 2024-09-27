import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ObjectId } from "mongodb";
import { CommentsQueryRepo } from "../../repo/comments.query.repository";
import { CommentsRepository } from "../../repo/comments.repository";
import { ResultCode } from "../../../../common/types/types";
import { UserOutputModel } from "../../../users/api/models/output/user.output.model";


export class DeleteCommentCommand {
    constructor(public id: string,
                public user: UserOutputModel){}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase implements ICommandHandler<DeleteCommentCommand>{
    constructor(protected commentsQueryRepo: CommentsQueryRepo,
                protected commentsRepository: CommentsRepository) { }
  
    async execute(command: DeleteCommentCommand): Promise<any> {
        const foundComment = await this.commentsQueryRepo.getCommentById(command.id);
        if(!foundComment) return {
            code: ResultCode.NotFound
        };
        if(foundComment.commentatorInfo.userId !== command.user.id) return {
            code: ResultCode.Forbidden
        }
        return await this.commentsRepository.deleteComment(command.id)
    }
  }