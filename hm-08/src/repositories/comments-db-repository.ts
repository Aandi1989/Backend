import { commentsCollection } from "../db/db"
import { CommentType, Result, ResultCode, UserOutputType } from "../types/types"

export const commentsRepository ={
    async createComment(newComment: CommentType):Promise<CommentType>{
        const result = await commentsCollection.insertOne(newComment)
        return this._mapDBCommentTypeToCommentType(newComment)
    },
    async deleteComment(id: string): Promise<Result>{
        const result = await commentsCollection.deleteOne({id: id})
        if(result.deletedCount === 1) return {
            code: ResultCode.Success
        }
        return {
            code: ResultCode.NotFound
        }
    },
    async updateComment(id: string, content: string): Promise<Result>{
        const result = await commentsCollection.updateOne(
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

// Ramon token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxNzA5MTMyNTIxMjUxIiwiaWF0IjoxNzA5Mzc2NjIzLCJleHAiOjE3MTE5Njg2MjN9.W45b09YB30P03SfYxmsTWQ1PgnJt7gnOxAvCUo9T1co