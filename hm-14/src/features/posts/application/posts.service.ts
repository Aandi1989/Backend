import { Injectable } from "@nestjs/common";
import { myStatus, PostType } from "../types/types";
import { PostsRepository } from "../repo/posts.repository";
import { CreatePostModel } from "../api/models/input/create-post.input.model";

@Injectable()
export class PostsService {
    constructor(protected postsRepository: PostsRepository){}

    async createPost(data: CreatePostModel, blogId?: string): Promise<PostType>{
        const newPost = {
            id: (+new Date()).toString(),
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: blogId ? blogId : data.blogId,
            blogName: data.blogName ? data.blogName : '',
            createdAt: new Date().toISOString(),
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: myStatus.None,
                newestLikes: []
            }
        }
        const createPost = await this.postsRepository.createPost(newPost)
        return createPost;
    }
    async updatePost(id: string, data: Partial<CreatePostModel>): Promise<boolean>{
        return await this.postsRepository.updatePost(id, data);
    }
    async deletePost(id: string):Promise<boolean> {
        return await this.postsRepository.deletePost(id)
    }
}