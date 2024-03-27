import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../repo/blogs.repository';
import { BlogType } from '../types/types';
import { CreateBlogModel } from '../api/models/input/create-blog.input.model';

@Injectable()
export class BlogsService {
    constructor(protected blogsRepository: BlogsRepository){}

    async createBlog(data: CreateBlogModel): Promise<BlogType>{
        const newBlog = {
            id: (+new Date()).toString(),
            name: data.name,
            description: data.description,
            websiteUrl: data.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        };
        const createdBlog = await this.blogsRepository.createBlog(newBlog)
        return createdBlog;
    } 
    async updateBlog(id: string ,data: Partial<CreateBlogModel>): Promise<boolean>{
        return await this.blogsRepository.updateBlog(id, data)
    }
    async deleteBlog(id: string):Promise<boolean> {
        return await this.blogsRepository.deleteBlog(id)
    }
}