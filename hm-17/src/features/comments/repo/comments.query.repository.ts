import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from '../domain/comments.schema';
import { CommentQueryOutputType, DBCommentType, myStatus } from '../types/types';
import { CommentOutputModel, CommentsWithQueryOutputModel } from '../api/models/output/comment.output.model';
import { defineStatus } from 'src/common/helpers/getCommentStatus';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { commentsOutputModel } from 'src/common/helpers/commentsOutoutModel';

@Injectable()
export class CommentsQueryRepo {
    constructor(@InjectDataSource() protected dataSourse: DataSource,
        @InjectModel(Comment.name)
        private CommentModel: Model<Comment>,
    ) { }
    // async getCommentsByPostId(postId: string, query: CommentQueryOutputType,
    //     userId: string = ''): Promise<CommentsWithQueryOutputModel> {
    //     const { pageNumber, pageSize, sortBy, sortDirection } = query;
    //     const sortDir = sortDirection == "asc" ? 1 : -1;
    //     const skip = (pageNumber - 1) * pageSize;
    //     const totalCount = await this.CommentModel.countDocuments({ postId: postId });
    //     const dbComments = await this.CommentModel
    //         .find({ postId: postId })
    //         .sort({ [sortBy]: sortDir })
    //         .skip(skip)
    //         .limit(pageSize)
    //         .lean() as DBCommentType[];
    //     const pagesCount = Math.ceil(totalCount / pageSize);
    //     return {
    //         pagesCount: pagesCount,
    //         page: pageNumber,
    //         pageSize: pageSize,
    //         totalCount: totalCount,
    //         items: dbComments.map(dbComment => {
    //             return this._mapDBCommentTypeToCommentType(dbComment, userId)
    //         })
    //     }
    // }

    async getCommentsByPostId(postId: string, query: CommentQueryOutputType,
        //                            CommentsWithQueryOutputModel
        userId: string = ''): Promise<any> {
        const { pageNumber, pageSize, sortBy, sortDirection } = query;
        const sortDir = sortDirection === "asc" ? "ASC" : "DESC";
        const offset = (pageNumber - 1) * pageSize;

        const totalCountQuery = `
            SELECT COUNT(*)
            FROM public."Comments"
        `;
        const totalCountResult = await this.dataSourse.query(totalCountQuery);
        const totalCount = totalCountResult[0].count;
        
        const mainQuery = `
            SELECT 
            comments.*,
            users."login" as "userLogin",
            (SELECT COUNT(*) 
            FROM public."LikesComments" 
            WHERE "commentId" = comments."id" AND "status" = 'Like') as "likesCount",
            (SELECT COUNT(*) 
            FROM public."LikesComments" 
            WHERE "commentId" = comments."id" AND "status" = 'Dislike') as "dislikesCount",
            ` +(userId ? `(SELECT likes."status"
                        FROM public."LikesComments" as likes
                        WHERE likes."userId" = '${userId}' AND comments."id" = likes."commentId") as "myStatus"` 
                    : ` 'None' as "myStatus" `) +
            ` FROM public."Comments" as comments
            LEFT JOIN public."Users" as users
            ON comments."userId" = users."id"
            ORDER BY "${sortBy}" ${sortDir}
            LIMIT $1
            OFFSET $2
        `;
        
        const comments = await this.dataSourse.query(mainQuery, [pageSize, offset]);
        const pagesCount = Math.ceil(totalCount / pageSize);
        return {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: commentsOutputModel(comments)
        };
    }
    async getCommentById(id: string, userId: string = ''): Promise<CommentOutputModel | null> {
        const query =
            `SELECT 
                comments.*,
                users."login" as "userLogin",
                (SELECT COUNT(*) 
                FROM public."LikesComments" 
                WHERE "commentId" = comments."id" AND "status" = 'Like') as "likesCount",
                (SELECT COUNT(*) 
                FROM public."LikesComments" 
                WHERE "commentId" = comments."id" AND "status" = 'Dislike') as "dislikesCount",
                ` +(userId ? `(SELECT likes."status"
                            FROM public."LikesComments" as likes
                            WHERE likes."userId" = '${userId}' AND comments."id" = likes."commentId") as "myStatus"` 
                        : ` 'None' as "myStatus" `) +
               ` FROM public."Comments" as comments
               LEFT JOIN public."Users" as users
                ON comments."userId" = users."id"
            WHERE comments."id" = $1`;
        const result = await this.dataSourse.query(query, [id]);
        const outputComment = commentsOutputModel(result)[0]

        return outputComment;
    }
    _mapDBCommentTypeToCommentType(comment: DBCommentType, userId: string = ''): CommentOutputModel {
        return {
            id: comment.id,
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt,
            likesInfo: {
                likesCount: comment.likes.length,
                dislikesCount: comment.dislikes.length,
                myStatus: defineStatus(comment, userId)
            }
        }
    }
}