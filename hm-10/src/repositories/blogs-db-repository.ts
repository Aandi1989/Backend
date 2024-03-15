import { blogsModel } from "../db/models";
import { BlogType, DBBlogType } from "../types/types";

export const blogsRepository = {
    async createBlog(newBlog: BlogType): Promise<BlogType>{
        const result = await blogsModel.insertMany([newBlog])
        //@ts-ignore
        return this._mapDBBlogToBlogOutputModel(newBlog)
    },
    async updateBlog(id: string ,data: Partial<BlogType>): Promise<boolean>{
        const result = await blogsModel.updateOne({id: id},{ $set: {...data} })
        return result.matchedCount === 1
    },
    async deleteBlog(id: string):Promise<boolean> {
        const result = await blogsModel.deleteOne({id: id})
        return result.deletedCount === 1
    },
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