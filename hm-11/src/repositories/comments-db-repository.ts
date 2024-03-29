import { commentsModel } from "../db/models"
import { CommentType, DBCommentType, Result, ResultCode, myStatus } from "../types/types"

export class CommentsRepository {
    async createComment(newComment: DBCommentType):Promise<CommentType>{
        const result = await commentsModel.insertMany([newComment])
        return this._mapDBCommentTypeToCommentTypeAfterCreating(newComment)
    }

    async deleteComment(id: string): Promise<Result>{
        const result = await commentsModel.deleteOne({id: id})
        if(result.deletedCount === 1) return {
            code: ResultCode.Success
        }
        return {
            code: ResultCode.NotFound
        }
    }

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
    }

    _mapDBCommentTypeToCommentTypeAfterCreating(comment: DBCommentType): CommentType{
        return{
            id: comment.id,
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt ,
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: myStatus.None
            }
        }
    }
}

