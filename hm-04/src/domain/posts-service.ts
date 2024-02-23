import { PostType } from "../db/db"
import { CreatePostModel } from "../features/posts/models/CreatePostModel";
import {postsRepository} from "../repositories/posts-db-repository";


export const postsService = {
    async getPosts(): Promise<PostType[]>{
        return postsRepository.getPosts();
    },
    async findPostById(id: string): Promise<PostType | null>{
        return postsRepository.findPostById(id);
    },
    async createPost(data: CreatePostModel): Promise<PostType>{
        const newPost = {
            id: (+new Date()).toString(),
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: data.blogId,
            blogName: data.blogName ? data.blogName : '',
            createdAt: new Date().toISOString()
        };
        const createPost = await postsRepository.createPost(newPost)
        return createPost;
    },
    async updatePost(id: string ,data: Partial<PostType>): Promise<boolean>{
        return await postsRepository.updatePost(id, data);
    },
    async deletePost(id: string):Promise<boolean> {
        return await postsRepository.deletePost(id)
    }
    

} 