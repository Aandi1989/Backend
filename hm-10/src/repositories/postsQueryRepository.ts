import { CommentQueryOutputType, PostQueryOutputType } from "../assets/queryStringModifiers";
import { postsModel } from "../db/models";
import { CommentType, DBCommentType, DBPostType, PostType, PostsWithQueryType } from "../types/types";

export const postsQueryRepo = {
    async getPosts(query: PostQueryOutputType): Promise<PostsWithQueryType> {
        const {pageNumber, pageSize, sortBy, sortDirection } = query;
        const sortDir = sortDirection == "asc" ? 1 : -1;  
        const skip = (pageNumber -1) * pageSize;  
        const totalCount = await postsModel.countDocuments();
        const dbPosts = await postsModel
        .find()
        .sort({[sortBy]: sortDir, id: 1})
        .skip(skip)
        .limit(pageSize)
        .lean();
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
        let dbPost: DBPostType | null = await postsModel.findOne({ id: id })
        return dbPost ? this._mapDBPostToBlogOutputModel(dbPost) : null;
    },
    async getPostsByBlogId(blogId: string, query:PostQueryOutputType): Promise<PostsWithQueryType>{
        const {pageNumber, pageSize, sortBy, sortDirection } = query;
        const sortDir = sortDirection == "asc" ? 1 : -1;  
        const skip = (pageNumber -1) * pageSize;  
        const totalCount = await postsModel.countDocuments({blogId: blogId});
        const dbPosts = await postsModel
        .find({blogId: blogId})
        .sort({[sortBy]: sortDir})
        .skip(skip)
        .limit(pageSize)
        .lean();
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
    },
}