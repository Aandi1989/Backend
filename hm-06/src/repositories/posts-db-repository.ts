import { postsCollection } from "../db/db"
import { DBPostType, PostType } from "../types/types";


export const postsRepository = {
    async createPost(newPost: PostType): Promise<PostType>{
        const result = await postsCollection.insertOne(newPost);
        // @ts-ignore
        return this._mapDBPostToBlogOutputModel(newPost);
    },
    async updatePost(id: string ,data: Partial<PostType>): Promise<boolean>{
        const result = await postsCollection.updateOne({id: id},{ $set: {...data} })
        return result.matchedCount === 1
    },
    async deletePost(id: string):Promise<boolean> {
        const result = await postsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },
    _mapDBPostToBlogOutputModel(post: DBPostType): PostType {
        return {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName ? post.blogName : '',
            createdAt: post.createdAt
        }
    }
    

} 