import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '../posts.schema';
import { DBPostType, myStatus, PostType } from '../types/types';

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
    async updatePost(id: string, data: Partial<PostType>): Promise<boolean> {
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