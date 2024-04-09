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
import { DataSource } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { postsOutputModel } from "src/common/helpers/postsOutputModel";


@Injectable()
export class PostsQueryRepo {
    constructor(@InjectDataSource() protected dataSourse: DataSource,
        @InjectModel(Post.name) private PostModel: Model<Post>,
        @InjectModel(Like.name) private LikeModel: Model<Like>,
        @InjectModel(User.name) private UserModel: Model<User>,

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
        const query =
            `SELECT posts.*, "likeCount", "dislikeCount", "myStatus", likes."createdAt" as "addedAt", likes."userId", users."login"
                FROM
                    (SELECT *, 
                    
                    (SELECT COUNT(*)
                                FROM public."LikesPosts"
                                WHERE "status" = 'Like') as "likeCount",
                    
                    (SELECT COUNT(*)
                                FROM public."LikesPosts"
                                WHERE "status" = 'Dislike') as "dislikeCount", ` +

                                (userId ? `(SELECT likes."status"
                                            FROM public."LikesPosts" as likes
                                            WHERE likes."userId" = '${userId}') as "myStatus"` 
                                        : ` 'None' as "myStatus" `) +
                    
                    ` FROM public."LikesPosts" as l
                    WHERE l."postId" = $1) as likes
                LEFT JOIN public."Posts" as posts
                ON likes."postId" = posts."id"
                LEFT JOIN public."Users" as users
                ON likes."userId" = users."id"
                ORDER BY likes."createdAt" ASC
                LIMIT 3`
        const result = await this.dataSourse.query(query, [id]);
        return postsOutputModel(result)[0];
    }
    async getPostsByBlogId(blogId: string, query: PostQueryOutputType, userId: string = ''): Promise<PostsWithQueryOutputModel> {
        const { pageNumber, pageSize, sortBy, sortDirection } = query;
        const sortDir = sortDirection == "asc" ? 1 : -1;
        const skip = (pageNumber - 1) * pageSize;
        const totalCount = await this.PostModel.countDocuments({ blogId: blogId });
        const dbPosts = await this.PostModel
            .find({ blogId: blogId })
            .sort({ [sortBy]: sortDir })
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
    // DBPostType
    async _mapDBPostToBlogOutputModel(post: any, userId: string): Promise<PostType> {
        // const likes = await this.LikeModel.find({parentId: post.id});
        // const { likesArray, dislikesCount, myStatusLike } = likeCounter(likes, userId);
        // const recentLikes = getRecentLikes(likesArray);
        // const recentLikesWithLogins = await Promise.all(recentLikes.map(async (like) => {
        //     const user = await this.UserModel.findOne({'accountData.id': like.userId})
        //     return { userId: like.userId, addedAt: like.createdAt, login: user!.accountData.login };
        // }));

        return {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName ? post.blogName : '',
            createdAt: post.createdAt,
            extendedLikesInfo: {
                // likesCount: likesArray.length,
                // dislikesCount: dislikesCount,
                // myStatus: myStatusLike,
                // newestLikes: recentLikesWithLogins
                likesCount: 0,
                dislikesCount: 0,
                myStatus: myStatus.None,
                newestLikes: []
            }
        }
    }
}
