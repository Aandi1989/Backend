import { db } from "../db/db"


export const postsRepository = {
    getPosts(){
        const posts = db.posts;
        return posts;
    },
    findPostById(id: string){
        const post = db.posts.find(p => p.id == id)
        return post;
    },
    

} 