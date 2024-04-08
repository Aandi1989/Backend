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
            WHERE name LIKE $1
        `;
        
        const totalCountResult = await this.dataSourse.query(totalCountQuery, [searchTermParam]);
        const totalCount = totalCountResult[0].count;
        // postgres doesnt allow use as params names of columns that is why we validate sortBy in function blogQueryParams
        const mainQuery = `
            SELECT * FROM public."Blogs"
            WHERE name LIKE $1
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
