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
            WHERE name ILIKE $1 AND "isBanned" = false
        `;
        
        const totalCountResult = await this.dataSourse.query(totalCountQuery, [searchTermParam]);
        const totalCount = parseInt(totalCountResult[0].count);
        // postgres doesnt allow use as params names of columns that is why we validate sortBy in function blogQueryParams
        const mainQuery = `
            SELECT * FROM public."Blogs"
            WHERE name ILIKE $1 AND "isBanned" = false
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

    async getBloggerBlogs(query: BlogQueryOutputType, userId: string): Promise<BlogsWithQueryOutputModel> {
        const { pageNumber, pageSize, searchNameTerm, sortBy, sortDirection } = query;
        const sortDir = sortDirection === "asc" ? "ASC" : "DESC";
        const offset = (pageNumber - 1) * pageSize;
        const searchTermParam = searchNameTerm ? `%${searchNameTerm}%` : `%%`;

        const totalCountQuery = `
            SELECT COUNT(*)
            FROM public."Blogs"
            WHERE name ILIKE $1
            AND "ownerId" = $2
        `;
        
        const totalCountResult = await this.dataSourse.query(totalCountQuery, [searchTermParam, userId]);
        const totalCount = parseInt(totalCountResult[0].count);
        // postgres doesnt allow use as params names of columns that is why we validate sortBy in function blogQueryParams
        const mainQuery = `
            SELECT "id", "name", "description", "websiteUrl", "createdAt", "isMembership" 
            FROM public."Blogs"
            WHERE name ILIKE $1
            AND "ownerId" = $2
            ORDER BY "${sortBy}" ${sortDir}
            LIMIT $3
            OFFSET $4
        `;

        const blogs = await this.dataSourse.query(mainQuery, [searchTermParam, userId, pageSize, offset]);
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
            FROM public."Blogs" as blogs
            WHERE blogs."id" = $1`;
        const result = await this.dataSourse.query(query, [id]);
        return result[0];
    }

    async findBlogByPostId(postId: string){
        const query = `
            SELECT *
            FROM public."Posts" as p
            LEFT JOIN public."Blogs" as b
                ON b."id" = p."blogId"
            WHERE p."id" = $1
        `;
        const result = await this.dataSourse.query(query, [postId]);
        return result[0];
    }

    async findBlogWithoutOwnerIdById(id: string): Promise<BlogType> {
        const query =
            `SELECT "id", "name", "description", "websiteUrl", "createdAt", "isMembership"
            FROM public."Blogs" as blogs
            WHERE blogs."id" = $1`;
        const result = await this.dataSourse.query(query, [id]);
        return result[0];
    }

    async isBannedBlog(userId: string, blogId: string){
        const query = `
            SELECT COUNT(*)
            FROM public."BlogBans"
            WHERE "userId" = '${userId}' AND "blogId" = '${blogId}'
        `;
        const result = await this.dataSourse.query(query);
        const isBanned = parseInt(result[0].count) ? true : false;
        return isBanned;
    }
}
