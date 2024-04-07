import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog } from '../domain/blogs.schema';
import { BlogQueryOutputType, BlogType, DBBlogType } from '../types/types';
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

        const mainQuery = `
            SELECT * FROM public."Blogs"
            WHERE name LIKE $1
            ORDER BY "${sortBy}" ${sortDir}
            LIMIT $2
            OFFSET $3
        `;
        console.log(mainQuery)
        const blogs = await this.dataSourse.query(mainQuery, [searchTermParam, `${pageSize}`, `${offset}`]);
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
    _mapDBBlogToBlogOutputModel(blog: DBBlogType): BlogType {
        return {
            id: blog.id,
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership
        }
    }
}

// async getBlogs(query: BlogQueryOutputType): Promise<any> {
//     const { pageNumber, pageSize, searchNameTerm, sortBy, sortDirection } = query;
//     const sortDir = sortDirection === "asc" ? "ASC" : "DESC";
//     const offset = (pageNumber - 1) * pageSize;
//     const search = searchNameTerm ? `WHERE name ILIKE '%' || $1 || '%'` : '';

//     const totalCountQuery = `
//         SELECT COUNT(*) AS total_count FROM public."Blogs"
//         ${search}
//     `;
//     const totalCountResult = await this.dataSourse.query(totalCountQuery, [searchNameTerm]);
//     const totalCount = totalCountResult.rows[0].total_count;

//     const mainQuery = `
//         SELECT * FROM public."Blogs"
//         ${search}
//         ORDER BY $2 ${sortDir}
//         LIMIT $3
//         OFFSET $4
//     `;
//     const result = await this.dataSourse.query(mainQuery, [sortBy, pageSize, offset]);
//     return result;
// }


// Рабочий вариант
// async getBlogs(query: BlogQueryOutputType): Promise<any> {
//     const { pageNumber, pageSize, searchNameTerm, sortBy, sortDirection } = query;
//     const sortDir = sortDirection === "asc" ? "ASC" : "DESC";
//     const offset = (pageNumber - 1) * pageSize;
//     const search = searchNameTerm ? `WHERE name ILIKE '%${searchNameTerm}%'` : '';

//     // Получение общего количества записей
//     const totalCountQuery = `
//         SELECT COUNT(*) AS total_count FROM public."Blogs"
//         ${search}
//     `;
//     const totalCountResult = await this.dataSourse.query(totalCountQuery);
//     // const totalCount = totalCountResult.rows[0].total_count;

//     // Запрос на получение данных
//     const mainQuery = `
//         SELECT * FROM public."Blogs"
//         ${search}
//         ORDER BY "${sortBy}" ${sortDir}
//         LIMIT ${pageSize}
//         OFFSET ${offset}
//     `;
//     console.log(totalCountQuery, mainQuery)
//     const dbBlogsResult = await this.dataSourse.query(mainQuery);
//     return dbBlogsResult;
// }