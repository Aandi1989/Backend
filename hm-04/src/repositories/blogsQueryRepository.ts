import { blogsCollection } from "../db/db";
import { BlogType, DBBlogType } from "../types";

export const blogsQueryRepo = {
    async getBlogs(): Promise<BlogType[]> {
        const dbBlogs = await blogsCollection.find().toArray();
        return dbBlogs.map(dbBlog => {
            return this._mapDBBlogToBlogOutputModel(dbBlog)
        })
    },
    async findBlogById(id: string): Promise<BlogType | null> {
        let dbBlog: DBBlogType | null = await blogsCollection.findOne({ id: id })
        return dbBlog ? this._mapDBBlogToBlogOutputModel(dbBlog) : null
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