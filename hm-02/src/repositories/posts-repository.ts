import { db } from "../db/db"

export const postsRepository = {
    findPostById(id: string){
        let post = db.posts.find(p => p.id == id)
        return post;
    }
} 