import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Post } from "../domain/posts.schema";
import { Model } from "mongoose";
import { DBPostType, myStatus, PostQueryOutputType, PostType } from "../types/types";
import { PostsWithQueryOutputModel } from "../api/models/output/post.output.model";
import { Like } from "src/features/likes/domain/likes.schema";
import { likeCounter } from "src/common/helpers/countLikes";
import { getRecentLikes } from "src/common/helpers/getRecentLikes";
import { User } from "src/features/users/domain/users.schema";


@Injectable()
export class PostsQueryRepo {
    constructor(
        @InjectModel(Post.name) private PostModel: Model<Post>,
        @InjectModel( Like.name) private LikeModel: Model<Like>,
        @InjectModel( User.name) private UserModel: Model<User>,

    ) { }
    async getPosts(query: PostQueryOutputType, userId: string = ''): Promise<PostsWithQueryOutputModel> {
        const { pageNumber, pageSize, sortBy, sortDirection } = query;
        const sortDir = sortDirection == "asc" ? 1 : -1;
        const skip = (pageNumber - 1) * pageSize;
        const totalCount = await this.PostModel.countDocuments();
        const dbPosts = await this.PostModel
            .find()
            .sort({ [sortBy]: sortDir, id: 1 })
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
        let dbPost: DBPostType | null = await this.PostModel.findOne({ id: id })
        return dbPost ? this._mapDBPostToBlogOutputModel(dbPost, userId) : null;
    }
    async getPostsByBlogId(blogId: string, query:PostQueryOutputType, userId: string = ''): Promise<PostsWithQueryOutputModel>{
        const {pageNumber, pageSize, sortBy, sortDirection } = query;
        const sortDir = sortDirection == "asc" ? 1 : -1;  
        const skip = (pageNumber -1) * pageSize;  
        const totalCount = await this.PostModel.countDocuments({blogId: blogId});
        const dbPosts = await this.PostModel
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
    async deleteAllData(){
        await this.PostModel.deleteMany({});
      }
    async _mapDBPostToBlogOutputModel(post: DBPostType, userId: string): Promise<PostType> {
        const likes = await this.LikeModel.find({parentId: post.id});
        const { likesArray, dislikesCount, myStatusLike } = likeCounter(likes, userId);
        const recentLikes = getRecentLikes(likesArray);
        const recentLikesWithLogins = await Promise.all(recentLikes.map(async (like) => {
            const user = await this.UserModel.findOne({'accountData.id': like.userId})
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