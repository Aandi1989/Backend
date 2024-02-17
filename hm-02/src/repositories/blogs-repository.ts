import { db } from "../db/db"
import { CreateBlogModel } from "../features/blogs/models/CreateBlogModel";

export const blogsRepository = {
    getBlogs(){
        let blogs = db.blogs;
        return blogs;
    },
    findBlogById(id: string){
        let blog = db.blogs.find(b => b.id == id)
        return blog;
    },
    createBlog(data: CreateBlogModel){
        const newBlog = {
            id: (+new Date()).toString(),
            name: data.name,
            description: data.description,
            websiteUrl: data.description
        };
        db.blogs.push(newBlog);
        return newBlog;
    }
} 