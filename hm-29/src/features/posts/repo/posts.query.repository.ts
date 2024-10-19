import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { PostsWithQueryOutputModel } from "../api/models/output/post.output.model";
import { PostQueryOutputType, PostType } from "../types/types";
import { postsOutputModel } from "../../../common/helpers/postsOutputModel";
import { likeExtraInfoMapper } from "../../../common/helpers/likeExtraInfoMapper";
import { postMapper } from "../../../common/helpers/postMapper";


@Injectable()
export class PostsQueryRepo {
    constructor(@InjectDataSource() protected dataSourse: DataSource) { }

    async getPosts(query: PostQueryOutputType, userId: string = ''):Promise<PostsWithQueryOutputModel>{
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
            WHERE users."isBanned" = false AND blogs."isBanned" = false
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
            WHERE users."isBanned" = false AND blogs."isBanned" = false
            ORDER BY p."${sortBy}" ${sortDir}, p."createdAt" ASC
            LIMIT $1 OFFSET $2
        `;

        const posts = await this.dataSourse.query(postQuery, [pageSize, offset]);
        posts.forEach(post => postIds.push(post.id));

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
        const postsOutput = postMapper(posts, likesOutput);
        const pagesCount = Math.ceil(totalCount / pageSize);

        return {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: postsOutput
        }
    } 

    async getPostById(id: string, userId: string = ''): Promise<PostType | null> {
        const postQuery = `
            SELECT p."id", p."title", p."shortDescription", p."content", p."blogId", p."blogName", p."createdAt"
            FROM public."Posts" as p
            LEFT JOIN public."Blogs" as blogs
                ON p."blogId" = blogs."id"
            LEFT JOIN public."Users" as users
                ON blogs."ownerId" = users."id"
            WHERE users."isBanned" = false AND p."id" = $1
        `;

        const posts = await this.dataSourse.query(postQuery, [id]);

        const likesQuery = `
            SELECT likes."createdAt" as "addedAt", likes."userId", users."login", likes."postId", likes."status"
            FROM public."LikesPosts" as likes
            LEFT JOIN public."Users" as users
                ON likes."userId" = users."id"
            WHERE likes."postId" = $1 AND users."isBanned" = false
            ORDER BY likes."createdAt" DESC
        `;
        const likes = await this.dataSourse.query(likesQuery, [id]);
        const likesOutput = likeExtraInfoMapper(likes, userId);
        const postOutput = postMapper(posts, likesOutput)[0];

        return postOutput;
    }

    async getPostsByBlogId(blogId: string, query: PostQueryOutputType, userId: string = ''): Promise<PostsWithQueryOutputModel> {
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
            WHERE posts."blogId" = $1 AND users."isBanned" = false
        `;

        const totalCountResult = await this.dataSourse.query(totalCountQuery, [blogId]);
        const totalCount = parseInt(totalCountResult[0].count);

        const postQuery = `
            SELECT p."id", p."title", p."shortDescription", p."content", p."blogId", p."blogName", p."createdAt"
            FROM public."Posts" as p
            LEFT JOIN public."Blogs" as blogs
                ON p."blogId" = blogs."id"
            LEFT JOIN public."Users" as users
                ON blogs."ownerId" = users."id"
            WHERE users."isBanned" = false AND p."blogId" = $1
            ORDER BY p."${sortBy}" ${sortDir}
            LIMIT $2 OFFSET $3
        `;

        const posts = await this.dataSourse.query(postQuery, [blogId, pageSize, offset]);
        posts.forEach(post => postIds.push(post.id));

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
        const postsOutput = postMapper(posts, likesOutput);
        const pagesCount = Math.ceil(totalCount / pageSize);

        return {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: postsOutput
        }
    }

    async getPostForChange(blogId: string, postId: string){
        const query = `
            SELECT posts.*, blogs."ownerId"
            FROM public."Posts" as posts
            LEFT JOIN public."Blogs" as blogs
            ON posts."blogId" = blogs."id"
            WHERE posts."id" = $1 AND posts."blogId" = $2
        `;

        const result = await this.dataSourse.query(query, [postId, blogId]);
        return result[0];
    }

    async getPostImages(postId: string){
        const query = `
            SELECT url, width, height, "fileSize"
            FROM public."PostImages"
            WHERE "postId" = $1; 
        `;
        const result = await this.dataSourse.query(query, [postId]);
        return result;
    }
}
