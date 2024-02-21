import { BlogType, blogsCollection } from "../db/db"
import { CreateBlogModel } from "../features/blogs/models/CreateBlogModel";

export const blogsRepository = {
    async getBlogs(): Promise<BlogType[]>{
        return blogsCollection.find({}, {projection: { _id: 0} }).toArray();
    },
    async findBlogById(id: string): Promise<BlogType | null>{
       let blog: BlogType | null = await blogsCollection.findOne({id:id}, {projection: { _id: 0}} )
       if(blog){
        return blog;
       }else{
        return null;
       }
    },
    async createBlog(data: CreateBlogModel): Promise<BlogType>{
        const newBlog = {
            id: (+new Date()).toString(),
            name: data.name,
            description: data.description,
            websiteUrl: data.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        };
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