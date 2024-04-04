import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ObjectId } from "mongodb";
import { UserOutputModel } from "src/features/users/api/models/output/user.output.model";
import { CommentsRepository } from "../../repo/comments.repository";


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
            id: (+new Date()).toString(),
            content: command.content,
            postId: command.postId,
            commentatorInfo: {
                userId: command.user.id,
                userLogin: command.user.login
            },
            createdAt: new Date().toISOString(),
            likes: [],
            dislikes: [],
            _id: new ObjectId()
        }
        const createdComment = await this.commentsRepository.createComment(newComment)
        return createdComment;
    }
  }