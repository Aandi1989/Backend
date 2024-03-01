import { commentsRepository } from "../repositories/comments-db-repository";
import { UserOutputType } from "../types/types";


export const commentsService = {
    async createComment(postId: string, content: string, user: UserOutputType){
        const newComment = {
            id: (+new Date()).toString(),
            content: content,
            postId: postId,
            commentatorInfo: {
                userId: user.id,
                userLogin: user.login
            },
            createdAt: new Date().toISOString()
        }
        const createdComment = await commentsRepository.createComment(newComment)
        return createdComment;
    }
}