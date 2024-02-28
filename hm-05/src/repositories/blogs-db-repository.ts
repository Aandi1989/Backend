import { blogsCollection } from "../db/db"
import { BlogType, DBBlogType } from "../types";

export const blogsRepository = {
    async createBlog(newBlog: BlogType): Promise<BlogType>{
        const result = await blogsCollection.insertOne(newBlog)
        //@ts-ignore
        return this._mapDBBlogToBlogOutputModel(newBlog)
    },
    async updateBlog(id: string ,data: Partial<BlogType>): Promise<boolean>{
        const result = await blogsCollection.updateOne({id: id},{ $set: {...data} })
        return result.matchedCount === 1
    },
    async deleteBlog(id: string):Promise<boolean> {
        const result = await blogsCollection.deleteOne({id: id})
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