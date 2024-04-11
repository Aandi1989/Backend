import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { postsOutputModel } from "src/common/helpers/postsOutputModel";
import { DataSource } from "typeorm";
import { PostsWithQueryOutputModel } from "../api/models/output/post.output.model";
import { PostQueryOutputType, PostType } from "../types/types";


@Injectable()
export class PostsQueryRepo {
    constructor(@InjectDataSource() protected dataSourse: DataSource) { }
    
    async getPosts(query: PostQueryOutputType, userId: string = ''): Promise<PostsWithQueryOutputModel> {
        const { pageNumber, pageSize, sortBy, sortDirection } = query;
        const sortDir = sortDirection === "asc" ? "ASC" : "DESC";
        const offset = (pageNumber - 1) * pageSize;

        const totalCountQuery = `
            SELECT COUNT(*)
            FROM public."Posts"
        `;
        const totalCountResult = await this.dataSourse.query(totalCountQuery);
        const totalCount = totalCountResult[0].count;
        
        const mainQuery = `
        SELECT 
            posts.*, 
            likes."userId",
            users."login",
            likes."createdAt" as "addedAt",
            (SELECT COUNT(*) 
            FROM public."LikesPosts" 
            WHERE "postId" = posts."id" AND "status" = 'Like') as "likesCount",
            (SELECT COUNT(*) 
            FROM public."LikesPosts" 
            WHERE "postId" = posts."id" AND "status" = 'Dislike') as "dislikesCount",
            ` +(userId ? `(SELECT likes."status"
                            FROM public."LikesPosts" as likes
                            WHERE likes."userId" = '${userId}' AND posts."id" = likes."postId") as "myStatus"` 
                        : ` 'None' as "myStatus" `) +
           ` FROM public."Posts" as posts
        LEFT JOIN 
            (SELECT *
            FROM public."LikesPosts"
            LIMIT 3) as likes
        ON posts."id" = likes."postId"
        LEFT JOIN 
        public."Users" as users
        ON likes."userId" = users."id"
        WHERE posts."id" IN (
            SELECT id FROM public."Posts"
            LIMIT $1
            OFFSET $2
        )
        ORDER BY posts."${sortBy}" ${sortDir}, likes."createdAt" ASC`
        
        const result = await this.dataSourse.query(mainQuery, [pageSize, offset]);
        const outputPost = postsOutputModel(result);
        return outputPost;
        
    }
    async getPostById(id: string, userId: string = ''): Promise<PostType | null> {
        const query =
            `SELECT posts.*, "likesCount", "dislikesCount", "myStatus", likes."createdAt" as "addedAt", likes."userId", users."login"
                FROM
                    (SELECT *, 
                    
                    (SELECT COUNT(*)
                                FROM public."LikesPosts"
                                WHERE "status" = 'Like') as "likesCount",
                    
                    (SELECT COUNT(*)
                                FROM public."LikesPosts"
                                WHERE "status" = 'Dislike') as "dislikesCount", ` +

                                (userId ? `(SELECT likes."status"
                                            FROM public."LikesPosts" as likes
                                            WHERE likes."userId" = '${userId}' AND '${id}' = likes."postId") as "myStatus"` 
                                        : ` 'None' as "myStatus" `) +
                    
                    ` FROM public."LikesPosts" as l
                    WHERE l."postId" = $1) as likes
                LEFT JOIN public."Posts" as posts
                ON likes."postId" = posts."id"
                LEFT JOIN public."Users" as users
                ON likes."userId" = users."id"
                WHERE likes."status" = 'Like' 
                ORDER BY likes."createdAt" ASC
                LIMIT 3`
        const result = await this.dataSourse.query(query, [id]);
        const outputPost = postsOutputModel(result)[0];
        return outputPost;
    }
    async getPostsByBlogId(blogId: string, query: PostQueryOutputType, userId: string = ''): Promise<PostsWithQueryOutputModel> {
        const { pageNumber, pageSize, sortBy, sortDirection } = query;
        const sortDir = sortDirection === "asc" ? "ASC" : "DESC";
        const offset = (pageNumber - 1) * pageSize;

        const totalCountQuery = `
            SELECT COUNT(*)
            FROM public."Posts" as posts
            WHERE posts."blogId" = $1
        `;
        const totalCountResult = await this.dataSourse.query(totalCountQuery, [blogId]);
        const totalCount = totalCountResult[0].count;

        const mainQuery = `
        SELECT 
            posts.*, 
            likes."userId",
            users."login",
            likes."createdAt" as "addedAt",
            (SELECT COUNT(*) 
            FROM public."LikesPosts" 
            WHERE "postId" = posts."id" AND "status" = 'Like') as "likesCount",
            (SELECT COUNT(*) 
            FROM public."LikesPosts" 
            WHERE "postId" = posts."id" AND "status" = 'Dislike') as "dislikesCount",
            ` +(userId ? `(SELECT likes."status"
                            FROM public."LikesPosts" as likes
                            WHERE likes."userId" = '${userId}' AND posts."id" = likes."postId") as "myStatus"` 
                        : ` 'None' as "myStatus" `) +
           ` FROM public."Posts" as posts
        LEFT JOIN 
            (SELECT *
            FROM public."LikesPosts"
            LIMIT 3) as likes
        ON posts."id" = likes."postId"
        LEFT JOIN 
        public."Users" as users
        ON likes."userId" = users."id"
        WHERE posts."id" IN (
            SELECT id FROM public."Posts"
            LIMIT $1
            OFFSET $2
        ) AND posts."blogId" = $3
        ORDER BY posts."${sortBy}" ${sortDir}, likes."createdAt" ASC`
        
        const result = await this.dataSourse.query(mainQuery, [pageSize, offset, blogId]);
        const outputPost = postsOutputModel(result);
        return outputPost;
       
    }
}
