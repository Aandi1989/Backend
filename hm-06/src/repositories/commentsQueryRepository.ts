import { CommentQueryOutputType } from "../assets/queryStringModifiers";
import { commentsCollection, postsCollection } from "../db/db";
import { CommentType, DBCommentType } from "../types/types";

export const commentsQueryRepo = {
    async getCommentsByPostId(postId: string, query: CommentQueryOutputType){
        const {pageNumber, pageSize, sortBy, sortDirection } = query;
        const sortDir = sortDirection == "asc" ? 1 : -1;  
        const skip = (pageNumber -1) * pageSize;  
        const totalCount = await commentsCollection.countDocuments({postId: postId});
        const dbComments = await commentsCollection
        .find({postId: postId})
        .sort({[sortBy]: sortDir})
        .skip(skip)
        .limit(pageSize)
        .toArray();
        const pagesCount = Math.ceil(totalCount / pageSize);
        return {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: dbComments.map(dbPost => {
                return this._mapDBCommentTypeToCommentType(dbPost)
            })
        }
    },
    _mapDBCommentTypeToCommentType(comment: DBCommentType): CommentType{
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