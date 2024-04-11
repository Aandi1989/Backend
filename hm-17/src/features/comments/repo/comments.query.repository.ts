import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { commentsOutputModel } from 'src/common/helpers/commentsOutoutModel';
import { DataSource } from 'typeorm';
import { CommentOutputModel, CommentsWithQueryOutputModel } from '../api/models/output/comment.output.model';
import { CommentQueryOutputType } from '../types/types';

@Injectable()
export class CommentsQueryRepo {
    constructor(@InjectDataSource() protected dataSourse: DataSource) { }

    async getCommentsByPostId(postId: string, query: CommentQueryOutputType,
        userId: string = ''): Promise<CommentsWithQueryOutputModel> {
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
            WHERE comments."postId" = $1
            ORDER BY "${sortBy}" ${sortDir}
            LIMIT $2
            OFFSET $3
        `;
        
        const comments = await this.dataSourse.query(mainQuery, [postId, pageSize, offset]);
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
}