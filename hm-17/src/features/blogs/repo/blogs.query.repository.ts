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
    constructor(
        @InjectDataSource() protected dataSourse: DataSource,
        @InjectModel(Blog.name)
        private BlogModel: Model<Blog>,
    ) { }
    async getBlogs(query: BlogQueryOutputType): Promise<BlogsWithQueryOutputModel> {
        const {pageNumber, pageSize, searchNameTerm, sortBy, sortDirection } = query;  
        const sortDir = sortDirection == "asc" ? 1 : -1;  
        const skip = (pageNumber -1) * pageSize; 
        const search = searchNameTerm ? { $regex: new RegExp(searchNameTerm, 'i') } : {$regex:''};
        const totalCount = await this.BlogModel.countDocuments({name: search}); 
        const dbBlogs = await this.BlogModel
        .find({name: search})
        .sort({[sortBy]: sortDir})
        .skip(skip)
        .limit(pageSize)
        .lean();
        const pagesCount = Math.ceil(totalCount / pageSize);
        return {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: dbBlogs.map(dbBlog => {
                return this._mapDBBlogToBlogOutputModel(dbBlog)
            })
        }
    }
    async findBlogById(id: string): Promise<BlogType | null> {
        let dbBlog: DBBlogType | null = await this.BlogModel.findOne({ id: id })
        return dbBlog ? this._mapDBBlogToBlogOutputModel(dbBlog) : null
    }
    // first raw SQL request
    async findUsers() {
        const result = await this.dataSourse.query(`
        SELECT *
        FROM public."MyFirstTable" as w
        `);
        return result;
      }
      // -------------------
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