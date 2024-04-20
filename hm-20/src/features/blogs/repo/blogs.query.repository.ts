import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { BlogsWithQueryOutputModel } from '../api/models/output/blog.output.model';
import { Blog } from '../domain/blog.entity';
import { BlogQueryOutputType } from '../types/types';

@Injectable()
export class BlogsQueryRepo {
    constructor(@InjectRepository(Blog) private readonly blogsRepository: Repository<Blog>) { }
    
    async getBlogs(query: BlogQueryOutputType): Promise<BlogsWithQueryOutputModel> {
        const { pageNumber, pageSize, searchNameTerm, sortBy, sortDirection } = query;
        const sortDir = sortDirection === "asc" ? "ASC" : "DESC";
        const offset = (pageNumber - 1) * pageSize;

        const totalCount = await this.blogsRepository
            .createQueryBuilder("blogs")
            .where([{ name: ILike(`%${searchNameTerm}%`)}])
            .getCount();

        const blogs = await this.blogsRepository
            .createQueryBuilder("blogs")
            .where([{ name: ILike(`%${searchNameTerm}%`)}])
            .orderBy(`blogs.${sortBy}`, sortDir)
            .limit(pageSize)
            .offset(offset)
            .getMany();

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
