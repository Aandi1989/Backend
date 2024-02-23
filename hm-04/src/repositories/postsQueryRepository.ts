import { postsCollection } from "../db/db";
import { DBPostType, PostType } from "../types";

export const postsQueryRepo = {
    async getPosts(): Promise<PostType[]> {
        const dbPosts = await postsCollection.find().toArray();
        return dbPosts.map(dbPost => {
            return this._mapDBPostToBlogOutputModel(dbPost)
        })
    },
    async getPostById(id: string): Promise<PostType | null> {
        let dbPost: DBPostType | null = await postsCollection.findOne({ id: id })
        return dbPost ? this._mapDBPostToBlogOutputModel(dbPost) : null;
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