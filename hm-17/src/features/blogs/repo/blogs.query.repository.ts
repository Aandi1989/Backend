import { Injectable } from '@nestjs/common';
import { BlogQueryOutputType, BlogType } from '../types/types';
import { BlogsWithQueryOutputModel } from '../api/models/output/blog.output.model';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class BlogsQueryRepo {
    constructor(@InjectDataSource() protected dataSourse: DataSource) { }
    async getBlogs(query: BlogQueryOutputType): Promise<BlogsWithQueryOutputModel> {
        const { pageNumber, pageSize, searchNameTerm, sortBy, sortDirection } = query;
        const sortDir = sortDirection === "asc" ? "ASC" : "DESC";
        const offset = (pageNumber - 1) * pageSize;
        const searchTermParam = searchNameTerm ? `%${searchNameTerm}%` : `%%`;

        const totalCountQuery = `
            SELECT COUNT(*)
            FROM public."Blogs"
            WHERE name ILIKE $1
        `;
        
        const totalCountResult = await this.dataSourse.query(totalCountQuery, [searchTermParam]);
        const totalCount = totalCountResult[0].count;
        // postgres doesnt allow use as params names of columns that is why we validate sortBy in function blogQueryParams
        const mainQuery = `
            SELECT * FROM public."Blogs"
            WHERE name ILIKE $1
            ORDER BY "${sortBy}" ${sortDir}
            LIMIT $2
            OFFSET $3
        `;

        const blogs = await this.dataSourse.query(mainQuery, [searchTermParam, pageSize, offset]);
        const pagesCount = Math.ceil(totalCount / pageSize);
        return {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: blogs
        };
    }
    async findBlogById(id: string): Promise<BlogType> {
        const query =
            `SELECT * 
            FROM public."Blogs"
            WHERE "id" = $1`;
        const result = await this.dataSourse.query(query, [id]);
        return result[0];
    }
}

// SELECT 
// 	posts.*, 
// 	likes."userId",
// 	users."login",
// 	likes."createdAt" as "addedAt",
// 	(SELECT COUNT(*) 
//  	FROM public."LikesPosts" 
//  	WHERE "postId" = posts."id" AND "status" = 'Like') as "likesCount",
//  	(SELECT COUNT(*) 
//  	FROM public."LikesPosts" 
//  	WHERE "postId" = posts."id" AND "status" = 'Dislike') as "dislikesCount"
// 	FROM public."Posts" as posts
// LEFT JOIN 
// 	(SELECT *
// 	FROM public."LikesPosts"
// 	ORDER BY "createdAt" ASC
// 	LIMIT 3) as likes
// ON posts."id" = likes."postId"
// LEFT JOIN 
// public."Users" as users
// ON likes."userId" = users."id"
// WHERE posts."id" IN (
//     SELECT id FROM public."Posts"
//     LIMIT 3
//     OFFSET 0
// )
// ORDER BY posts."createdAt" ASC



