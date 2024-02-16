import { db } from "../db/db"

export const blogsRepository = {
    findBlogById(id: string){
        let blog = db.blogs.find(b => b.id == id)
        return blog;
    }
} 