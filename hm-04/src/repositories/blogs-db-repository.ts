import { BlogType, blogsCollection } from "../db/db"

export const blogsRepository = {
    async getBlogs(): Promise<BlogType[]>{
        return blogsCollection.find({}, {projection: { _id: 0} }).toArray();
    },
    async findBlogById(id: string): Promise<BlogType | null>{
       let blog: BlogType | null = await blogsCollection.findOne({id:id}, {projection: { _id: 0}} )
       return blog
    },
    async createBlog(newBlog: BlogType): Promise<BlogType>{
        const result = await blogsCollection.insertOne(newBlog)
        return newBlog;
    },
    async updateBlog(id: string ,data: Partial<BlogType>): Promise<boolean>{
        const result = await blogsCollection.updateOne({id: id},{ $set: {...data} })
        return result.matchedCount === 1
    },
    async deleteBlog(id: string):Promise<boolean> {
        const result = await blogsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    }
} 