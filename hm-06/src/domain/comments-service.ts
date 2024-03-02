import { commentsRepository } from "../repositories/comments-db-repository";
import { commentsQueryRepo } from "../repositories/commentsQueryRepository";
import { Result, ResultCode, UserOutputType } from "../types/types";


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
    },
    async deleteComment(id: string, user: UserOutputType): Promise<Result> {
        const foundComment = await commentsQueryRepo.getCommentById(id);
        if(!foundComment) return {
            code: ResultCode.NotFound
        };
        if(foundComment.commentatorInfo.userId !== user.id) return {
            code: ResultCode.Forbidden
        }
        return await commentsRepository.deleteComment(id)
    },
    async updateComment(id: string, content: string, user: UserOutputType): Promise<Result>{
        const foundComment = await commentsQueryRepo.getCommentById(id);
        if(!foundComment) return {
            code: ResultCode.NotFound
        };
        if(foundComment.commentatorInfo.userId !== user.id) return {
            code: ResultCode.Forbidden
        }
        return await commentsRepository.updateComment(id, content)
    }
}