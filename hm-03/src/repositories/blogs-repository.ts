import { BlogType, db } from "../db/db"
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
            websiteUrl: data.websiteUrl
        };
        db.blogs.push(newBlog);
        return newBlog;
    },
    updateBlog(id: string ,data: Partial<BlogType>){
        const { name, description, websiteUrl } = data;
        let blog = db.blogs.find(b => b.id == id);
        if(blog){
            blog.name = name ? name : blog.name;
            blog.description = description ? description : blog.description;
            blog.websiteUrl = websiteUrl ? websiteUrl : blog.websiteUrl;
            return true;
        }else{
            return false;
        }
    },
    deleteBlog(id: string) {
        for (let i = 0; i < db.blogs.length; i++) {
            if (db.blogs[i].id === id) {
                db.blogs.splice(i, 1);
                return true;
            }
        }
        return false;
    }
} 