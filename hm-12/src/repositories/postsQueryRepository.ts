import { likeCounter } from "../assets/countLikes";
import { getRecentLikes } from "../assets/getResentLikes";
import { PostQueryOutputType } from "../assets/queryStringModifiers";
import { likesModel, postsModel, usersModel } from "../db/models";
import { DBPostType, PostType, PostsWithQueryType } from "../types/types";
import { injectable } from 'inversify';

@injectable()
export class PostsQueryRepo {
    async getPosts(query: PostQueryOutputType, userId: string = ''): Promise<PostsWithQueryType> {
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

        const itemsPromises = dbPosts.map(dbPost => {
            return this._mapDBPostToBlogOutputModel(dbPost, userId);
        });
        const items = await Promise.all(itemsPromises);

        return {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: items
        }
    }

    async getPostById(id: string, userId: string = ''): Promise<PostType | null> {
        let dbPost: DBPostType | null = await postsModel.findOne({ id: id })
        return dbPost ? this._mapDBPostToBlogOutputModel(dbPost, userId) : null;
    }

    async getPostsByBlogId(blogId: string, query:PostQueryOutputType, userId: string = ''): Promise<PostsWithQueryType>{
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

        const itemsPromises = dbPosts.map(dbPost => {
            return this._mapDBPostToBlogOutputModel(dbPost, userId);
        });
        const items = await Promise.all(itemsPromises);

        return {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: items
        }
    }

    async _mapDBPostToBlogOutputModel(post: DBPostType, userId: string): Promise<PostType> {
        const likes = await likesModel.find({parentId: post.id});
        const { likesArray, dislikesCount, myStatusLike } = likeCounter(likes, userId);
        const recentLikes = getRecentLikes(likesArray);
        const recentLikesWithLogins = await Promise.all(recentLikes.map(async (like) => {
            const user = await usersModel.findOne({'accountData.id': like.userId})
            return { userId: like.userId, addedAt: like.createdAt, login: user!.accountData.login };
        }));

         return {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName ? post.blogName : '',
            createdAt: post.createdAt,
            extendedLikesInfo: {
                likesCount: likesArray.length,
                dislikesCount: dislikesCount,
                myStatus: myStatusLike,
                newestLikes: recentLikesWithLogins
            }
        }
    }
}
