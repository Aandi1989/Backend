import { defineStatus } from "../assets/helperCommentStatus";
import { CommentQueryOutputType } from "../assets/queryStringModifiers";
import { commentsModel } from "../db/models";
import { CommentType, DBCommentType, myStatus } from "../types/types";

export class CommentsQueryRepo {
    async getCommentsByPostId(postId: string, query: CommentQueryOutputType, userId: string = ''){
        const {pageNumber, pageSize, sortBy, sortDirection } = query;
        const sortDir = sortDirection == "asc" ? 1 : -1;  
        const skip = (pageNumber -1) * pageSize;  
        const totalCount = await commentsModel.countDocuments({postId: postId});
        const dbComments = await commentsModel
        .find({postId: postId})
        .sort({[sortBy]: sortDir})
        .skip(skip)
        .limit(pageSize)
        .lean();
        const pagesCount = Math.ceil(totalCount / pageSize);
        return {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: dbComments.map(dbPost => {
                return this._mapDBCommentTypeToCommentType(dbPost, userId)
            })
        }
    }

    async getCommentById(id: string, userId: string = ''):Promise<CommentType | null>{
        let dbComment: DBCommentType | null = await commentsModel.findOne({ id: id })
        return dbComment ? this._mapDBCommentTypeToCommentType(dbComment, userId) : null;
    }

    async getDBTypeCommentById(id: string):Promise<DBCommentType | null>{
        let dbComment: DBCommentType | null = await commentsModel.findOne({ id: id })
        return dbComment ? dbComment : null;
    }

    _mapDBCommentTypeToCommentType(comment: DBCommentType, userId: string = ''): CommentType{
        return{
            id: comment.id,
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt ,
            likesInfo: {
                likesCount: comment.likes.length,
                dislikesCount: comment.dislikes.length,
                myStatus: defineStatus(comment, userId)
            }
        }
    }
}
