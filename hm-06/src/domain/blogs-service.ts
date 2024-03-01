
import { CreateBlogModel } from "../features/blogs/models/CreateBlogModel";
import { blogsRepository } from "../repositories/blogs-db-repository"; 
import { BlogType } from "../types";

export const blogsService = {
    async createBlog(data: CreateBlogModel): Promise<BlogType>{
        const newBlog = {
            id: (+new Date()).toString(),
            name: data.name,
            description: data.description,
            websiteUrl: data.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        };
        const createdBlog = await blogsRepository.createBlog(newBlog)
        return createdBlog;
    },
    async updateBlog(id: string ,data: Partial<BlogType>): Promise<boolean>{
        return await blogsRepository.updateBlog(id, data)
    },
    async deleteBlog(id: string):Promise<boolean> {
        return await blogsRepository.deleteBlog(id)
    }
} 