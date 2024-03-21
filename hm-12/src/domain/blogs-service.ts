
import { CreateBlogModel } from "../features/blogs/models/CreateBlogModel";
import { BlogsRepository } from "../repositories/blogs-db-repository"; 
import { BlogType } from "../types/types";
import { injectable } from 'inversify';

@injectable()
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

    async updateBlog(id: string ,data: Partial<BlogType>): Promise<boolean>{
        return await this.blogsRepository.updateBlog(id, data)
    }

    async deleteBlog(id: string):Promise<boolean> {
        return await this.blogsRepository.deleteBlog(id)
    }
};
