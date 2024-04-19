import { Injectable } from '@nestjs/common';
import { BlogQueryOutputType, BlogType } from '../types/types';
import { BlogsWithQueryOutputModel } from '../api/models/output/blog.output.model';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Blog } from '../domain/blog.entity';

@Injectable()
export class BlogsQueryRepo {
    constructor(@InjectDataSource() protected dataSourse: DataSource,
                @InjectRepository(Blog) private readonly blogsRepository: Repository<Blog>) { }
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
        const totalCount = parseInt(totalCountResult[0].count);
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
    async findBlogById(id: string): Promise<any> {
        const result = await this.blogsRepository.findOneBy({id: id});
        return result;
    }
}
