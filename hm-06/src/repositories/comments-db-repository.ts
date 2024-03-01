import { commentsCollection } from "../db/db"
import { CommentType } from "../types/types"

export const commentsRepository ={
    async createComment(newComment: CommentType):Promise<CommentType>{
        const result = await commentsCollection.insertOne(newComment)
        return this._mapDBCommentTypeToCommentType(newComment)
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