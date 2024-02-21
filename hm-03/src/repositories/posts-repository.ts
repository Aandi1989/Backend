import { PostType } from "../db/db"
import { db } from "../db/fakeDb"
import { CreatePostModel } from "../features/posts/models/CreatePostModel";


export const postsRepository = {
    getPosts(){
        const posts = db.posts;
        return posts;
    },
    findPostById(id: string){
        const post = db.posts.find(p => p.id == id)
        return post;
    },
    createPost(data: CreatePostModel){
        const newPost = {
            id: (+new Date()).toString(),
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: data.blogId,
            blogName: data.blogName ? data.blogName : '',
            createdAt: new Date().toISOString()
        };
        db.posts.push(newPost);
        return newPost;
    },
    updatePost(id: string ,data: Partial<PostType>){
        const { title, shortDescription, content, blogId, blogName } = data;
        let post = db.posts.find(p => p.id == id);
        if(post){
            post.title = title ? title : post.title;
            post.shortDescription = shortDescription ? shortDescription : post.shortDescription;
            post.content = content ? content : post.content;
            post.blogId = blogId ? blogId : post.blogId;
            post.blogName = blogName ? blogName : post.blogName;
            return true;
        }else{
            return false;
        }
    },
    deletePost(id: string) {
        for (let i = 0; i < db.posts.length; i++) {
            if (db.posts[i].id === id) {
                db.posts.splice(i, 1);
                return true;
            }
        }
        return false;
    }
    

} 