import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { PostsWithQueryOutputModel } from "../api/models/output/post.output.model";
import { PostQueryOutputType, PostType } from "../types/types";
import { postsOutputModel } from "../../../common/helpers/postsOutputModel";
import { likeExtraInfoMapper } from "../../../common/helpers/likeExtraInfoMapper";


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
        const totalCount = parseInt(totalCountResult[0].count);
        
        const mainQuery = `
            WITH DistinctPosts AS (
                SELECT posts.*, 
                    (SELECT COUNT(*) 
                        FROM public."LikesPosts" as likes
                        LEFT JOIN public."Users" as users
                            ON likes."userId" = users."id"
                        WHERE "postId" = posts."id" 
                            AND "status" = 'Like'
                            AND users."isBanned" = false) as "likesCount",
                    (SELECT COUNT(*) 
                        FROM public."LikesPosts" as likes
                        LEFT JOIN public."Users" as users
                            ON likes."userId" = users."id"
                        WHERE "postId" = posts."id" 
                            AND "status" = 'Dislike'
                            AND users."isBanned" = false) as "dislikesCount", `
                    +(userId ? `(SELECT likes."status"
                                        FROM public."LikesPosts" as likes
                                         WHERE likes."userId" = '${userId}' AND posts."id" = likes."postId") as "myStatus"` 
                                     : ` 'None' as "myStatus" `) +
                ` FROM public."Posts" as posts
                ORDER BY posts."${sortBy}" ${sortDir}
                LIMIT $1 OFFSET $2
            )
            SELECT DistinctPosts.*,
                    likes."userId",
                    users."login",
                    likes."createdAt" as "addedAt" 
            FROM DistinctPosts 
            LEFT JOIN (
                SELECT *, ROW_NUMBER() OVER (PARTITION BY "postId" ORDER BY "createdAt" DESC) as row_num
                FROM public."LikesPosts"
                WHERE "status" = 'Like'
            ) as likes 
            ON DistinctPosts."id" = likes."postId" AND likes.row_num <= 3
            LEFT JOIN public."Users" as users 
            ON likes."userId" = users."id"
            WHERE users."isBanned" = false
            ORDER BY DistinctPosts."${sortBy}" ${sortDir}, likes."createdAt" DESC
        `;
        
        const posts = await this.dataSourse.query(mainQuery, [pageSize, offset]);
        const outputPosts = postsOutputModel(posts);
        const pagesCount = Math.ceil(totalCount / pageSize);
        
        return {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: outputPosts
        }; 
    }
    //                                                                     Promise<PostsWithQueryOutputModel>
    async getPostsUpdated(query: PostQueryOutputType, userId: string = ''):Promise<any>{
        const { pageNumber, pageSize, sortBy, sortDirection } = query;
        const sortDir = sortDirection === "asc" ? "ASC" : "DESC";
        const offset = (pageNumber - 1) * pageSize;
        const postIds: string[] = [];

        const totalCountQuery = `
            SELECT COUNT(*)
            FROM public."Posts" as posts
            LEFT JOIN public."Blogs" as blogs
                ON posts."blogId" = blogs."id"
            LEFT JOIN public."Users" as users
                ON blogs."ownerId" = users."id"
            WHERE users."isBanned" = false
        `;

        const totalCountResult = await this.dataSourse.query(totalCountQuery);
        const totalCount = parseInt(totalCountResult[0].count);
        
        const postQuery = `
            SELECT p."id", p."title", p."shortDescription", p."content", p."blogId", p."blogName", p."createdAt"
            FROM public."Posts" as p
            LEFT JOIN public."Blogs" as blogs
                ON p."blogId" = blogs."id"
            LEFT JOIN public."Users" as users
                ON blogs."ownerId" = users."id"
            WHERE users."isBanned" = false
            ORDER BY p."${sortBy}" ${sortDir}
            LIMIT $1 OFFSET $2
        `;

        const posts = await this.dataSourse.query(postQuery, [pageSize, offset]);
        posts.forEach(post => postIds.push(post.id));

        // console.log('posts-->', posts);
        // console.log('postIds-->', postIds);

        const likesQuery = `
            SELECT likes."createdAt" as "addedAt", likes."userId", users."login", likes."postId", likes."status"
            FROM public."LikesPosts" as likes
            LEFT JOIN public."Users" as users
                ON likes."userId" = users."id"
            WHERE likes."postId" = ANY($1) AND users."isBanned" = false
            ORDER BY likes."createdAt" DESC
        `;
        const likes = await this.dataSourse.query(likesQuery, [postIds]);
        const likesOutput = likeExtraInfoMapper(likes, userId);
        // console.dir(likesOutput, {depth: null});
        // console.log('likesQuery-->', likesQuery);
        // console.log('likes-->', likes);
        return totalCount;
    } 

    async getPostById(id: string, userId: string = ''): Promise<PostType | null> {
        // return only one row 
        const query =`
                    SELECT posts.*,
                    likes."userId",
                    users."login",
                    likes."createdAt" as "addedAt",
                    (SELECT COUNT(*)
                                FROM public."LikesPosts" as likes
                                WHERE likes."postId" = $1 AND "status" = 'Like') 
                                as "likesCount",
                    
                    (SELECT COUNT(*)
                                FROM public."LikesPosts" as likes
                                WHERE likes."postId" = $1 AND "status" = 'Dislike') 
                                as "dislikesCount", ` +
                                
                    (userId ? `(SELECT likes."status"
                                    FROM public."LikesPosts" as likes
                                    WHERE likes."userId" = '${userId}' AND likes."postId" = '${id}') as "myStatus"` 
                                : ` 'None' as "myStatus" `) +
                        
                                `FROM public."Posts" as posts
                    LEFT JOIN 
                        (SELECT *
                            FROM public."LikesPosts" as likes
                            WHERE likes."status" = 'Like'
                            ORDER BY likes."createdAt" DESC
                            LIMIT 3) as likes
                    ON posts."id" = likes."postId"
                    LEFT JOIN 
                    public."Users" as users
                    ON likes."userId" = users."id"
                    WHERE posts."id" = $1
                   
        `;

        // doesn't work if there are no likes for post
        // const query = `
        //     WITH DistinctPosts AS (
        //         SELECT posts.*, 
        //             (SELECT COUNT(*) 
        //                 FROM public."LikesPosts" as likes
        //                 LEFT JOIN public."Users" as users
        //                     ON likes."userId" = users."id"
        //                 WHERE "postId" = posts."id" 
        //                     AND "status" = 'Like'
        //                     AND users."isBanned" = false) as "likesCount",
        //             (SELECT COUNT(*) 
        //                 FROM public."LikesPosts" as likes
        //                 LEFT JOIN public."Users" as users
        //                     ON likes."userId" = users."id"
        //                 WHERE "postId" = posts."id" 
        //                     AND "status" = 'Dislike'
        //                     AND users."isBanned" = false) as "dislikesCount", `
        //             +(userId ? `(SELECT likes."status"
        //                                 FROM public."LikesPosts" as likes
        //                                  WHERE likes."userId" = '${userId}' AND posts."id" = likes."postId") as "myStatus"` 
        //                              : ` 'None' as "myStatus" `) +
        //         ` FROM public."Posts" as posts
        //     )
        //     SELECT DistinctPosts.*,
        //             likes."userId",
        //             users."login",
        //             likes."createdAt" as "addedAt" 
        //     FROM DistinctPosts 
        //     LEFT JOIN (
        //         SELECT *, ROW_NUMBER() OVER (PARTITION BY "postId" ORDER BY "createdAt" DESC) as row_num
        //         FROM public."LikesPosts"
        //         WHERE "status" = 'Like'
        //     ) as likes 
        //     ON DistinctPosts."id" = likes."postId" AND likes.row_num <= 3
        //     LEFT JOIN public."Users" as users 
        //     ON likes."userId" = users."id"
        //     WHERE users."isBanned" = false AND DistinctPosts."id" = $1
        //     ORDER BY likes."createdAt" DESC
        // `;

           
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
        const totalCount = parseInt(totalCountResult[0].count);

        const mainQuery = `
            WITH DistinctPosts AS (
                SELECT posts.*, 
                    (SELECT COUNT(*) FROM public."LikesPosts" WHERE "postId" = posts."id" AND "status" = 'Like') as "likesCount",
                    (SELECT COUNT(*) FROM public."LikesPosts" WHERE "postId" = posts."id" AND "status" = 'Dislike') as "dislikesCount", `
                    +(userId ? `(SELECT likes."status"
                                        FROM public."LikesPosts" as likes
                                         WHERE likes."userId" = '${userId}' AND posts."id" = likes."postId") as "myStatus"` 
                                     : ` 'None' as "myStatus" `) +
                ` FROM public."Posts" as posts
                WHERE posts."blogId" = $3
                ORDER BY posts."${sortBy}" ${sortDir}
                LIMIT $1 OFFSET $2
            )
            SELECT DistinctPosts.*,
                    likes."userId",
                    users."login",
                    likes."createdAt" as "addedAt" 
            FROM DistinctPosts 
            LEFT JOIN (
                SELECT *, ROW_NUMBER() OVER (PARTITION BY "postId" ORDER BY "createdAt" DESC) as row_num
                FROM public."LikesPosts"
                WHERE "status" = 'Like'
            ) as likes 
            ON DistinctPosts."id" = likes."postId" AND likes.row_num <= 3
            LEFT JOIN public."Users" as users 
            ON likes."userId" = users."id"
            ORDER BY DistinctPosts."${sortBy}" ${sortDir}, likes."createdAt" DESC
        `;

        const posts = await this.dataSourse.query(mainQuery, [pageSize, offset, blogId]);
        const outputPosts = postsOutputModel(posts);
        const pagesCount = Math.ceil(totalCount / pageSize);
        
        return {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: outputPosts
        }; 
    }
    async getPostForChange(blogId: string, postId: string){
        const query = `
            SELECT posts.*
            FROM public."Posts" as posts
            LEFT JOIN public."Blogs" as blogs
            ON posts."blogId" = blogs."id"
            WHERE posts."id" = $1 AND posts."blogId" = $2
        `;

        const result = await this.dataSourse.query(query, [postId, blogId]);
        return result[0];
    }
}
