// import { commentsCollection } from "../db/db"
import { commentsModel } from "../db/models"
import { CommentType, Result, ResultCode, UserOutputType } from "../types/types"

export const commentsRepository ={
    async createComment(newComment: CommentType):Promise<CommentType>{
        const result = await commentsModel.insertMany([newComment])
        return this._mapDBCommentTypeToCommentType(newComment)
    },
    async deleteComment(id: string): Promise<Result>{
        const result = await commentsModel.deleteOne({id: id})
        if(result.deletedCount === 1) return {
            code: ResultCode.Success
        }
        return {
            code: ResultCode.NotFound
        }
    },
    async updateComment(id: string, content: string): Promise<Result>{
        const result = await commentsModel.updateOne(
            {id: id},
            { $set: {content: content}}
        );
        if(result.modifiedCount === 1) return {
            code: ResultCode.Success
        }
        return {
            code: ResultCode.NotFound
        }
    },
    _mapDBCommentTypeToCommentType(comment: CommentType): CommentType{
        return{
            id: comment.id,
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt 
        }
    }
}
