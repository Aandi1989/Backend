import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '../domain/posts.schema';
import { DBPostType, myStatus, PostType } from '../types/types';
import { CreatePostModel } from '../api/models/input/create-post.input.model';

@Injectable()
export class PostsRepository {
    constructor(
        @InjectModel(Post.name)
        private PostModel: Model<Post>,
    ) { }

    async createPost(newPost: PostType): Promise<PostType> {
        const result = await this.PostModel.insertMany([newPost]);
        // @ts-ignore
        return this._mapDBPostToBlogOutputModel(newPost);
    }
    async updatePost(id: string, data: Partial<CreatePostModel>): Promise<boolean> {
        const result = await this.PostModel.updateOne({ id: id }, { $set: { ...data } })
        return result.matchedCount === 1
    }
    async deletePost(id: string): Promise<boolean> {
        const result = await this.PostModel.deleteOne({ id: id })
        return result.deletedCount === 1
    }
    async deleteAllData(){
        await this.PostModel.deleteMany({});
      }
    _mapDBPostToBlogOutputModel(post: DBPostType): PostType {
        return {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName ? post.blogName : '',
            createdAt: post.createdAt,
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: myStatus.None,
                newestLikes: []
            }
        }
    }
}