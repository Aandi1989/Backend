import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ObjectId } from "mongodb";
import { UserOutputModel } from "src/features/users/api/models/output/user.output.model";
import { CommentsQueryRepo } from "../../repo/comments.query.repository";
import { ResultCode } from "src/common/types/types";
import { CommentsRepository } from "../../repo/comments.repository";


export class UpdateCommentCommand {
    constructor(public id: string,
                public content: string,
                public user: UserOutputModel){}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase implements ICommandHandler<UpdateCommentCommand>{
    constructor(protected commentsQueryRepo: CommentsQueryRepo,
                protected commentsRepository: CommentsRepository) { }
  
    async execute(command: UpdateCommentCommand): Promise<any> {
        const foundComment = await this.commentsQueryRepo.getCommentWithoutLikesById(command.id);
        if(!foundComment) return {
            code: ResultCode.NotFound
        };
        if(foundComment.userId !== command.user.id) return {
            code: ResultCode.Forbidden
        }
        return await this.commentsRepository.updateComment(command.id, command.content)
    }
  }