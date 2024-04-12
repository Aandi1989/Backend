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
            FROM public."Comments" as comments
            WHERE comments."postId" = $1
        `;
        const totalCountResult = await this.dataSourse.query(totalCountQuery, [postId]);
        const totalCount = parseInt(totalCountResult[0].count);
        
        // const mainQuery = `
        //     SELECT 
        //     comments.*,
        //     users."login" as "userLogin",
        //     (SELECT COUNT(*) 
        //     FROM public."LikesComments" 
        //     WHERE "commentId" = comments."id" AND "status" = 'Like') as "likesCount",
        //     (SELECT COUNT(*) 
        //     FROM public."LikesComments" 
        //     WHERE "commentId" = comments."id" AND "status" = 'Dislike') as "dislikesCount",
        //     ` +(userId ? `(SELECT likes."status"
        //                 FROM public."LikesComments" as likes
        //                 WHERE likes."userId" = '${userId}' AND comments."id" = likes."commentId") as "myStatus"` 
        //             : ` 'None' as "myStatus" `) +
        //     ` FROM public."Comments" as comments
        //     LEFT JOIN public."Users" as users
        //     ON comments."userId" = users."id"
        //     WHERE comments."postId" = $1
        //     ORDER BY "${sortBy}" ${sortDir}
        //     LIMIT $2
        //     OFFSET $3
        // `;

        // const mainQuery = `
        //     WITH DistinctComments AS (
        //         SELECT comments.*, 
        //             (SELECT COUNT(*) FROM public."LikesComments" WHERE "commentId" = comments."id" AND "status" = 'Like') as "likesCount",
        //             (SELECT COUNT(*) FROM public."LikesComments" WHERE "commentId" = comments."id" AND "status" = 'Dislike') as "dislikesCount", `
        //             +(userId ? `(SELECT likes."status"
        //                                 FROM public."LikesComments" as likes
        //                                  WHERE likes."userId" = '${userId}' AND comments."id" = likes."commentId") as "myStatus"` 
        //                              : ` 'None' as "myStatus" `) +
        //         ` FROM public."Comments" as comments
        //         WHERE comments."postId" = $3
        //         LIMIT $1 OFFSET $2
        //     )
        //     SELECT DistinctComments.*,
        //             users."login" as "userLogin"
        //     FROM DistinctComments 
        //     LEFT JOIN (
        //         SELECT *, ROW_NUMBER() OVER (PARTITION BY "commentId" ORDER BY "createdAt" DESC) as row_num
        //         FROM public."LikesComments"
        //         WHERE "status" = 'Like'
        //     ) as likes 
        //     ON DistinctComments."id" = likes."commentId" AND likes.row_num <= 3
        //     LEFT JOIN public."Users" as users 
        //     ON DistinctComments."userId" = users."id"
        //     ORDER BY DistinctComments."${sortBy}" ${sortDir}, likes."createdAt" DESC
        // `;

        // const superRequest =`
        // WITH DistinctComments AS (
        //     SELECT comments.*, 
        //         (SELECT COUNT(*) FROM public."LikesComments" WHERE "commentId" = comments."id" AND "status" = 'Like') as "likesCount",
        //         (SELECT COUNT(*) FROM public."LikesComments" WHERE "commentId" = comments."id" AND "status" = 'Dislike') as "dislikesCount", `
                
        //         + (userId ? `(SELECT likes."status"
        //         FROM public."LikesComments" as likes
        //          WHERE likes."userId" = '${userId}' AND comments."id" = likes."commentId") as "myStatus"` 
        //      : ` 'None' as "myStatus" `) +  

        //     ` FROM public."Comments" as comments
        //     WHERE comments."postId" = $3
        //     LIMIT $1 OFFSET $2
        // )
        // SELECT 
        //     DistinctComments.*,
        //     users."login" as "userLogin"
        // FROM DistinctComments
        // LEFT JOIN public."Users" as users 
        // ON users."id" = DistinctComments."userId"
        // ORDER BY DistinctComments."${sortBy}" ${sortDir}
        // `;

        const forthRequest = `
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
            WHERE comments."postId" = $3
            ORDER BY comments."${sortBy}" ${sortDir}
            LIMIT $1 OFFSET $2
        `;
            
        const comments = await this.dataSourse.query(forthRequest, [ pageSize, offset, postId]);
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