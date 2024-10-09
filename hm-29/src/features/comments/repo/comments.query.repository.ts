import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CommentOutputModel, CommentsWithQueryOutputModel } from '../api/models/output/comment.output.model';
import { CommentQueryOutputType } from '../types/types';
import { commentsOutputModel } from '../../../common/helpers/commentsOutoutModel';
import { commentsOutputWithPostInfoModel } from '../../../common/helpers/commentsOutWithPostInfoModel';

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
            LEFT JOIN public."Users" as users
                ON comments."userId" = users."id"
            WHERE comments."postId" = $1 AND users."isBanned" = false
        `;
        const totalCountResult = await this.dataSourse.query(totalCountQuery, [postId]);
        const totalCount = parseInt(totalCountResult[0].count);


        const mainRequest = `
                SELECT 
                comments.*,
                users."login" as "userLogin",
                (SELECT COUNT(*) 
                FROM public."LikesComments" as likes
                LEFT JOIN public."Users" as users
                    ON likes."userId" = users."id"
                WHERE "commentId" = comments."id" 
                    AND "status" = 'Like' 
                    AND users."isBanned" = false) as "likesCount",
                (SELECT COUNT(*) 
                FROM public."LikesComments" as likes
                LEFT JOIN public."Users" as users
                    ON likes."userId" = users."id"
                WHERE "commentId" = comments."id" 
                    AND "status" = 'Dislike'
                    AND users."isBanned" = false) as "dislikesCount",
                ` +(userId ? `(SELECT likes."status"
                            FROM public."LikesComments" as likes
                            WHERE likes."userId" = '${userId}' AND comments."id" = likes."commentId") as "myStatus"` 
                        : ` 'None' as "myStatus" `) +
            ` FROM public."Comments" as comments
            LEFT JOIN public."Users" as users
                ON comments."userId" = users."id"
            WHERE comments."postId" = $3 AND users."isBanned" = false
            ORDER BY comments."${sortBy}" ${sortDir}
            LIMIT $1 OFFSET $2
        `;
            
        const comments = await this.dataSourse.query(mainRequest, [ pageSize, offset, postId]);
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
                FROM public."LikesComments" as likes
                LEFT JOIN public."Users" as users
                    ON likes."userId" = users."id"
                WHERE "commentId" = comments."id" AND "status" = 'Like' AND users."isBanned" = false) as "likesCount",
                (SELECT COUNT(*) 
                FROM public."LikesComments" as likes
                LEFT JOIN public."Users" as users
                    ON likes."userId" = users."id"
                WHERE "commentId" = comments."id" AND "status" = 'Dislike' AND users."isBanned" = false) as "dislikesCount",
                ` +(userId ? `(SELECT likes."status"
                            FROM public."LikesComments" as likes
                            WHERE likes."userId" = '${userId}' AND comments."id" = likes."commentId") as "myStatus"` 
                        : ` 'None' as "myStatus" `) +
               ` FROM public."Comments" as comments
               LEFT JOIN public."Users" as users
                ON comments."userId" = users."id"
            WHERE comments."id" = $1 AND users."isBanned" = false`;
        const result = await this.dataSourse.query(query, [id]);
        const outputComment = commentsOutputModel(result)[0]

        return outputComment;
    }

    async getCommentsForAllBloggerPosts(query: CommentQueryOutputType,
        userId: string): Promise<CommentsWithQueryOutputModel> {
        const { pageNumber, pageSize, sortBy, sortDirection } = query;
        const sortDir = sortDirection === "asc" ? "ASC" : "DESC";
        const offset = (pageNumber - 1) * pageSize;

        const totalCountQuery = `
            SELECT COUNT(*)
            FROM public."Comments" as comments
            LEFT JOIN public."Posts" as posts
                ON comments."postId" = posts."id"
            LEFT JOIN public."Blogs" as blogs
                ON posts."blogId" = blogs."id"
            LEFT JOIN public."Users" as users
                ON users."id" = blogs."ownerId"
            WHERE blogs."ownerId" = '${userId}' AND users."isBanned" = false
        `;
        const totalCountResult = await this.dataSourse.query(totalCountQuery);
        const totalCount = parseInt(totalCountResult[0].count);


        const mainRequest = `
                SELECT 
                comments.*,
                posts."title", posts."blogId", blogs."name" as "blogName",
                users."login" as "userLogin",
                (SELECT COUNT(*) 
                FROM public."LikesComments" as likes
                LEFT JOIN public."Users" as users
                    ON likes."userId" = users."id"
                WHERE "commentId" = comments."id" 
                    AND "status" = 'Like' 
                    AND users."isBanned" = false) as "likesCount",
                (SELECT COUNT(*) 
                FROM public."LikesComments" as likes
                LEFT JOIN public."Users" as users
                    ON likes."userId" = users."id"
                WHERE "commentId" = comments."id" 
                    AND "status" = 'Dislike'
                    AND users."isBanned" = false) as "dislikesCount",
                ` +(userId ? `(SELECT likes."status"
                            FROM public."LikesComments" as likes
                            WHERE likes."userId" = '${userId}' AND comments."id" = likes."commentId") as "myStatus"` 
                        : ` 'None' as "myStatus" `) +
            ` FROM public."Comments" as comments
            LEFT JOIN public."Users" as users
                ON comments."userId" = users."id"
            LEFT JOIN public."Posts" as posts
                ON posts."id" = comments."postId"
            LEFT JOIN public."Blogs" as blogs
                ON posts."blogId" = blogs."id"
            WHERE users."isBanned" = false
            ORDER BY comments."${sortBy}" ${sortDir}
            LIMIT $1 OFFSET $2
        `;
            
        const comments = await this.dataSourse.query(mainRequest, [ pageSize, offset]);
        const pagesCount = Math.ceil(totalCount / pageSize);
        return {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: commentsOutputWithPostInfoModel(comments)
        };
    }
}