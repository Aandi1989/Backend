import { URIParamsBlogIdModel } from "../features/blogs/models/URIParamsBlogIdModel";
import { CreatePostModel } from "../features/posts/models/CreatePostModel";
import { commentsRepository } from "../repositories/comments-db-repository";
import {postsRepository} from "../repositories/posts-db-repository";
import { PostType, UserOutputType } from "../types/types";


export const postsService = {
    async createPost(data: CreatePostModel, params?:URIParamsBlogIdModel): Promise<PostType>{
        const newPost = {
            id: (+new Date()).toString(),
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: params?.blogId ? params.blogId : data.blogId,
            blogName: data.blogName ? data.blogName : '',
            createdAt: new Date().toISOString()
        };
        const createPost = await postsRepository.createPost(newPost)
        return createPost;
    },
    async updatePost(id: string, data: Partial<PostType>): Promise<boolean>{
        return await postsRepository.updatePost(id, data);
    },
    async deletePost(id: string):Promise<boolean> {
        return await postsRepository.deletePost(id)
    },
    
} 