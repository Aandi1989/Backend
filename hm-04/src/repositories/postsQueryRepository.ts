import { PostQueryOutputType } from "../assets/queryStringModifiers";
import { postsCollection } from "../db/db";
import { DBPostType, PostType, PostsWithQueryType } from "../types";

export const postsQueryRepo = {
    async getPosts(query: PostQueryOutputType): Promise<PostsWithQueryType> {
        const {pageNumber, pageSize, sortBy, sortDirection } = query;
        const sortDir = sortDirection == "asc" ? 1 : -1;  
        const skip = (pageNumber -1) * pageSize;  
        const totalCount = await postsCollection.countDocuments();
        const dbPosts = await postsCollection
        .find()
        .sort({[sortBy]: sortDir})
        .skip(skip)
        .limit(pageSize)
        .toArray();
        const pagesCount = Math.ceil(totalCount / pageSize);
        return {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: dbPosts.map(dbPost => {
                return this._mapDBPostToBlogOutputModel(dbPost)
            })
        }
    },
    async getPostById(id: string): Promise<PostType | null> {
        let dbPost: DBPostType | null = await postsCollection.findOne({ id: id })
        return dbPost ? this._mapDBPostToBlogOutputModel(dbPost) : null;
    },
    async getPostsByBlogId(blogId: string, query:PostQueryOutputType): Promise<PostsWithQueryType>{
        const {pageNumber, pageSize, sortBy, sortDirection } = query;
        const sortDir = sortDirection == "asc" ? 1 : -1;  
        const skip = (pageNumber -1) * pageSize;  
        const totalCount = await postsCollection.countDocuments({blogId: blogId});
        const dbPosts = await postsCollection
        .find({blogId: blogId})
        .sort({[sortBy]: sortDir})
        .skip(skip)
        .limit(pageSize)
        .toArray();
        const pagesCount = Math.ceil(totalCount / pageSize);
        return {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: dbPosts.map(dbPost => {
                return this._mapDBPostToBlogOutputModel(dbPost)
            })
        }
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