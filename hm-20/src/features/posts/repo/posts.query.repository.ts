import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { updatedPostsOutputModel } from "src/common/helpers/postsOutputModel";
import { LikesPosts } from "src/features/likes/domain/likes.entity";
import { Repository } from "typeorm";
import { PostsWithQueryOutputModel } from "../api/models/output/post.output.model";
import { Post } from "../domain/post.entity";
import { PostQueryOutputType, PostType } from "../types/types";


@Injectable()
export class PostsQueryRepo {
    constructor(@InjectRepository(Post) private readonly postRepository: Repository<Post>,
                @InjectRepository(LikesPosts) private readonly likesPostsRepository: Repository<LikesPosts>) { }
    
    async getPosts(query: PostQueryOutputType, userId: string = ''): Promise<PostsWithQueryOutputModel> {
        const { pageNumber, pageSize, sortBy, sortDirection } = query;
        const sortDir = sortDirection === "asc" ? "ASC" : "DESC";
        const offset = (pageNumber - 1) * pageSize;

        let posts: any = [];
        let lastThreeLikes: any = [];

        const totalCount = await this.postRepository
            .createQueryBuilder("post")
            .getCount();

        posts = await this.postRepository
                .createQueryBuilder("post")
                .select([`post.*, 
                (select COUNT(*) from "likes_posts" where "likes_posts"."postId" = post."id" AND "status" = 'Like') AS "likesCount",
                (select COUNT(*) from "likes_posts" where "likes_posts"."postId" = post."id" AND "status" = 'Dislike') AS "dislikesCount"`])
                .addSelect(`${userId}`  ?  `(SELECT "likes_posts"."status" FROM "likes_posts" WHERE "likes_posts"."userId" = :userId 
                                                                                AND "likes_posts"."postId" = post."id") "myStatus"`
                                    : `'None' AS "myStatus"`)
                .setParameter("userId", userId)
                .orderBy(`post.${sortBy}`, sortDir)
                .groupBy("post.id")
                .limit(pageSize)
                .offset(offset)
                .getRawMany();
            
                if(posts.length != 0){
                    const ids = posts.map(entry => entry.id);
           
                    lastThreeLikes = await this.likesPostsRepository
                        .createQueryBuilder("likes_posts")
                        .select(["likes_posts.*" ,"user.login"])
                        .leftJoin(
                            (subQuery) => {
                                return subQuery
                                    .from("likes_posts", "likes_posts")
                                    .select("likes_posts.id", "likeId") 
                                    .addSelect(`ROW_NUMBER() OVER (PARTITION BY likes_posts."postId" ORDER BY "likes_posts"."createdAt" DESC) as rn`)
                                    .where(`likes_posts.postId IN (:...ids)`, { ids })
                            }, 
                            "likes_with_rn",
                            `likes_posts.id = likes_with_rn."likeId"`
                        )
                        .leftJoin("user", "user", `user.id = likes_posts."userId"`)
                        .where(`likes_with_rn.rn <= 3 AND likes_posts."status" = 'Like'`) 
                        .orderBy("likes_posts.createdAt", "DESC")
                        .getRawMany();
        }
            

        const outputPosts = updatedPostsOutputModel(posts, lastThreeLikes);
        const pagesCount = Math.ceil(totalCount / pageSize);

        return {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: outputPosts
        }; 
    }
    async getPostById(id: string, userId: string = ''): Promise<PostType> {
        const post = await this.postRepository
                .createQueryBuilder("post")
                .select([`post.*, 
                (select COUNT(*) from "likes_posts" where "likes_posts"."postId" = post.id AND "status" = 'Like') AS "likesCount",
                (select COUNT(*) from "likes_posts" where "likes_posts"."postId" = post.id AND "status" = 'Dislike') AS "dislikesCount"`])
                .addSelect(`${userId}`  ?  `(SELECT "likes_posts"."status" FROM "likes_posts" WHERE "likes_posts"."userId" = :userId 
                                                                                AND "likes_posts"."postId" = post.id) "myStatus"`
                                    : `'None' AS "myStatus"`)
                .setParameter("userId", userId)
                .where("post.id = :id", {id})
                .getRawOne();

        if(!post)  throw new NotFoundException('Post not found');

        const lastThreeLikes = await this.likesPostsRepository
                .createQueryBuilder("likes_posts")
                .select(["likes_posts.*" ,"user.login"])
                .leftJoin(
                    (subQuery) => {
                        return subQuery
                            .from("likes_posts", "likes_posts")
                            .select("likes_posts.id", "likeId") 
                            .addSelect(`ROW_NUMBER() OVER (PARTITION BY likes_posts."postId" ORDER BY "likes_posts"."createdAt" DESC) as rn`)
                            .where(`likes_posts.postId = :id`, { id })
                    }, 
                    "likes_with_rn",
                    `likes_posts.id = likes_with_rn."likeId"`
                )
                .leftJoin("user", "user", `user.id = likes_posts."userId"`)
                .where(`likes_with_rn.rn <= 3 AND likes_posts."status" = 'Like'`) 
                .orderBy("likes_posts.createdAt", "DESC")
                .getRawMany();

        const outputPost = updatedPostsOutputModel([post], lastThreeLikes);

        return outputPost;
    }
    async getPostsByBlogId(blogId: string, query: PostQueryOutputType, userId: string = ''): Promise<PostsWithQueryOutputModel> {
        const { pageNumber, pageSize, sortBy, sortDirection } = query;
        const sortDir = sortDirection === "asc" ? "ASC" : "DESC";
        const offset = (pageNumber - 1) * pageSize;
        
        let posts: any = [];
        let lastThreeLikes: any = [];

        const totalCount = await this.postRepository
            .createQueryBuilder("post")
            .where("post.blogId = :blogId", {blogId})
            .getCount();

        posts = await this.postRepository
            .createQueryBuilder("post")
            .select([`post.*, 
            (select COUNT(*) from "likes_posts" where "likes_posts"."postId" = post."id" AND "status" = 'Like') AS "likesCount",
            (select COUNT(*) from "likes_posts" where "likes_posts"."postId" = post."id" AND "status" = 'Dislike') AS "dislikesCount"`])
            .addSelect(`${userId}`  ?  `(SELECT "likes_posts"."status" FROM "likes_posts" WHERE "likes_posts"."userId" = :userId 
                                                                            AND "likes_posts"."postId" = post."id") "myStatus"`
                                : `'None' AS "myStatus"`)
            .setParameter("userId", userId)
            .where("post.blogId = :blogId", {blogId})
            .orderBy(`post.${sortBy}`, sortDir)
            .groupBy("post.id")
            .limit(pageSize)
            .offset(offset)
            .getRawMany();

        if(posts.length != 0){
            const ids = posts.map(entry => entry.id);

            lastThreeLikes = await this.likesPostsRepository
                .createQueryBuilder("likes_posts")
                .select(["likes_posts.*" ,"user.login"])
                .leftJoin(
                    (subQuery) => {
                        return subQuery
                            .from("likes_posts", "likes_posts")
                            .select("likes_posts.id", "likeId") 
                            .addSelect(`ROW_NUMBER() OVER (PARTITION BY likes_posts."postId" ORDER BY "likes_posts"."createdAt" DESC) as rn`)
                            .where(`likes_posts.postId IN (:...ids)`, { ids })
                    }, 
                    "likes_with_rn",
                    `likes_posts.id = likes_with_rn."likeId"`
                )
                .leftJoin("user", "user", `user.id = likes_posts."userId"`)
                .where(`likes_with_rn.rn <= 3 AND likes_posts."status" = 'Like'`) 
                .orderBy("likes_posts.createdAt", "DESC")
                .getRawMany();
        }
        
            const outputPosts = updatedPostsOutputModel(posts, lastThreeLikes);
            const pagesCount = Math.ceil(totalCount / pageSize);
        
            return {
                    pagesCount: pagesCount,
                    page: pageNumber,
                    pageSize: pageSize,
                    totalCount: totalCount,
                    items: outputPosts
            }; 
    }
    async getPostWithoutLikesByBlogIdAndPostId(blogId: string, postId: string){
        const result = await this.postRepository.findOneBy({id: postId, blogId: blogId});
        return result;
    }
    async getPostWithoutLikesById(postId: string){
        const result = await this.postRepository.findOneBy({id: postId});
        return result;
    }
}
