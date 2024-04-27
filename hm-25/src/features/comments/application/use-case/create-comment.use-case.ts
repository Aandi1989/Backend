import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CommentsRepository } from "../../repo/comments.repository";
import {v4 as uuidv4} from 'uuid';
import { UserOutputModel } from "../../../users/api/models/output/user.output.model";


export class CreateCommentCommand {
    constructor(public postId: string,
                public content: string,
                public user: UserOutputModel){}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase implements ICommandHandler<CreateCommentCommand>{
    constructor(protected commentsRepository: CommentsRepository) { }
  
    async execute(command: CreateCommentCommand): Promise<any> {
        const newComment = {
            id: uuidv4(),
            content: command.content,
            postId: command.postId,
            userId: command.user.id,
            createdAt: new Date().toISOString()
        }
        const createdComment = await this.commentsRepository.createComment(newComment)
        return createdComment;
    }
  }