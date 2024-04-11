import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UserOutputModel } from "src/features/users/api/models/output/user.output.model";
import { CommentsRepository } from "../../repo/comments.repository";
import {v4 as uuidv4} from 'uuid';


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