import { URIParamsBlogIdModel } from "../features/blogs/models/URIParamsIdModel";
import { CreatePostModel } from "../features/posts/models/CreatePostModel";
import {postsRepository} from "../repositories/posts-db-repository";
import { PostType } from "../types";


export const postsService = {
    async createPost(data: CreatePostModel, params?:URIParamsBlogIdModel): Promise<PostType>{
        const newPost = {
            id: (+new Date()).toString(),
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: params?.id ? params.id : data.blogId,
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