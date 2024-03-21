import { postsModel } from "../db/models";
import { CommentType, DBCommentType, DBPostType, myStatus, PostType } from "../types/types";


export class PostsRepository {
    async createPost(newPost: PostType): Promise<PostType> {
        const result = await postsModel.insertMany([newPost]);
        // @ts-ignore
        return this._mapDBPostToBlogOutputModel(newPost);
    }

    async updatePost(id: string, data: Partial<PostType>): Promise<boolean> {
        const result = await postsModel.updateOne({ id: id }, { $set: { ...data } })
        return result.matchedCount === 1
    }

    async deletePost(id: string): Promise<boolean> {
        const result = await postsModel.deleteOne({ id: id })
        return result.deletedCount === 1
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
