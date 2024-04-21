import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { postsOutputModel } from "src/common/helpers/postsOutputModel";
import { DataSource, Repository, SelectQueryBuilder } from "typeorm";
import { PostsWithQueryOutputModel } from "../api/models/output/post.output.model";
import { myStatus, PostQueryOutputType, PostType } from "../types/types";
import { Post } from "../domain/post.entity";
import { User } from "../../users/domain/user.entity";
import { LikesPosts } from "src/features/likes/domain/likes.entity";


@Injectable()
export class PostsQueryRepo {
    constructor(@InjectDataSource() protected dataSourse: DataSource,
                @InjectRepository(Post) private readonly postRepository: Repository<Post>,
                @InjectRepository(User) private readonly userRepository: Repository<User>,
                @InjectRepository(LikesPosts) private readonly likesPostsRepository: Repository<LikesPosts>) { }
    
    // async getPosts(query: PostQueryOutputType, userId: string = ''): Promise<PostsWithQueryOutputModel> {
    //     const { pageNumber, pageSize, sortBy, sortDirection } = query;
    //     const sortDir = sortDirection === "asc" ? "ASC" : "DESC";
    //     const offset = (pageNumber - 1) * pageSize;

    //     const totalCountQuery = `
    //         SELECT COUNT(*)
    //         FROM public."Posts"
    //     `;
    //     const totalCountResult = await this.dataSourse.query(totalCountQuery);
    //     const totalCount = parseInt(totalCountResult[0].count);
        
    //     const mainQuery = `
    //         WITH DistinctPosts AS (
    //             SELECT posts.*, 
    //                 (SELECT COUNT(*) FROM public."LikesPosts" WHERE "postId" = posts."id" AND "status" = 'Like') as "likesCount",
    //                 (SELECT COUNT(*) FROM public."LikesPosts" WHERE "postId" = posts."id" AND "status" = 'Dislike') as "dislikesCount", `
    //                 +(userId ? `(SELECT likes."status"
    //                                     FROM public."LikesPosts" as likes
    //                                      WHERE likes."userId" = '${userId}' AND posts."id" = likes."postId") as "myStatus"` 
    //                                  : ` 'None' as "myStatus" `) +
    //             ` FROM public."Posts" as posts
    //             ORDER BY posts."${sortBy}" ${sortDir}
    //             LIMIT $1 OFFSET $2
    //         )
    //         SELECT DistinctPosts.*,
    //                 likes."userId",
    //                 users."login",
    //                 likes."createdAt" as "addedAt" 
    //         FROM DistinctPosts 
    //         LEFT JOIN (
    //             SELECT *, ROW_NUMBER() OVER (PARTITION BY "postId" ORDER BY "createdAt" DESC) as row_num
    //             FROM public."LikesPosts"
    //             WHERE "status" = 'Like'
    //         ) as likes 
    //         ON DistinctPosts."id" = likes."postId" AND likes.row_num <= 3
    //         LEFT JOIN public."Users" as users 
    //         ON likes."userId" = users."id"
    //         ORDER BY DistinctPosts."${sortBy}" ${sortDir}, likes."createdAt" DESC
    //     `;
        
    //     const posts = await this.dataSourse.query(mainQuery, [pageSize, offset]);
    //     const outputPosts = postsOutputModel(posts);
    //     const pagesCount = Math.ceil(totalCount / pageSize);
        
    //     return {
    //         pagesCount: pagesCount,
    //         page: pageNumber,
    //         pageSize: pageSize,
    //         totalCount: totalCount,
    //         items: outputPosts
    //     }; 
    // }

    //                                                                         PostsWithQueryOutputModel
    async getPosts(query: PostQueryOutputType, userId: string = ''): Promise<any> {
        const { pageNumber, pageSize, sortBy, sortDirection } = query;
        const sortDir = sortDirection === "asc" ? "ASC" : "DESC";
        const offset = (pageNumber - 1) * pageSize;

        const totalCount = await this.postRepository
            .createQueryBuilder("post")
            .getCount();

            const posts = await this.postRepository
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
            
            const ids = posts.map(entry => entry.id);
           

            const lastThreeLikes = await this.likesPostsRepository
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
                .where(`likes_with_rn.rn <= 4 AND likes_posts."status" = 'Like'`) 
                .orderBy("likes_posts.createdAt", "DESC")
                .getRawMany();

        return posts;

    }


    
    
    
    // async getPostById(id: string, userId: string = ''): Promise<PostType | null> {
    //     const query =`
    //                 SELECT posts.*,
    //                 likes."userId",
    //                 users."login",
    //                 likes."createdAt" as "addedAt",
    //                 (SELECT COUNT(*)
    //                             FROM public."LikesPosts" as likes
    //                             WHERE likes."postId" = $1 AND "status" = 'Like') 
    //                             as "likesCount",
                    
    //                 (SELECT COUNT(*)
    //                             FROM public."LikesPosts" as likes
    //                             WHERE likes."postId" = $1 AND "status" = 'Dislike') 
    //                             as "dislikesCount", ` +
                                
    //                 (userId ? `(SELECT likes."status"
    //                                 FROM public."LikesPosts" as likes
    //                                 WHERE likes."userId" = '${userId}' AND likes."postId" = '${id}') as "myStatus"` 
    //                             : ` 'None' as "myStatus" `) +
                        
    //                             `FROM public."Posts" as posts
    //                 LEFT JOIN 
    //                     (SELECT *
    //                         FROM public."LikesPosts" as likes
    //                         WHERE likes."status" = 'Like'
    //                         ORDER BY likes."createdAt" DESC
    //                         LIMIT 3) as likes
    //                 ON posts."id" = likes."postId"
    //                 LEFT JOIN 
    //                 public."Users" as users
    //                 ON likes."userId" = users."id"
    //                 WHERE posts."id" = $1
                   
    //     `;
           
    //     const result = await this.dataSourse.query(query, [id]);
    //     const outputPost = postsOutputModel(result)[0];
    //     return outputPost;

    // }
    //          Not finished                            PostType | null
    async getPostById(id: string, userId: string = ''): Promise<any> {
        const postsIds = await this.postRepository
        .createQueryBuilder("post")
        .select("post.id")
        .groupBy("post.id")
        .limit(4)  
        .getRawMany();

        const ids = postsIds.map(entry => entry.post_id);

        const result = await this.postRepository
            .createQueryBuilder("post")
            .select()
            .leftJoinAndSelect(
                subQuery => {
                    return subQuery
                        .select()
                        .from("likes_posts", "likes_posts")
                        .orderBy(`likes_posts."createdAt"`, "ASC")
                        .limit(3)
                },
                "likes_posts",
                `likes_posts."postId" = post.id `
            )
            .where('post.id IN (:...ids)', { ids })
            .getRawMany()
        
        return result;
        
   }
    async getPostsByBlogId(blogId: string, query: PostQueryOutputType, userId: string = ''): Promise<PostsWithQueryOutputModel> {
        const { pageNumber, pageSize, sortBy, sortDirection } = query;
        const sortDir = sortDirection === "asc" ? "ASC" : "DESC";
        const offset = (pageNumber - 1) * pageSize;

        const totalCountQuery = `
            SELECT COUNT(*)
            FROM public."Posts" as posts
            WHERE posts."blogId" = $1
        `;
        const totalCountResult = await this.dataSourse.query(totalCountQuery, [blogId]);
        const totalCount = parseInt(totalCountResult[0].count);

        const mainQuery = `
            WITH DistinctPosts AS (
                SELECT posts.*, 
                    (SELECT COUNT(*) FROM public."LikesPosts" WHERE "postId" = posts."id" AND "status" = 'Like') as "likesCount",
                    (SELECT COUNT(*) FROM public."LikesPosts" WHERE "postId" = posts."id" AND "status" = 'Dislike') as "dislikesCount", `
                    +(userId ? `(SELECT likes."status"
                                        FROM public."LikesPosts" as likes
                                         WHERE likes."userId" = '${userId}' AND posts."id" = likes."postId") as "myStatus"` 
                                     : ` 'None' as "myStatus" `) +
                ` FROM public."Posts" as posts
                WHERE posts."blogId" = $3
                ORDER BY posts."${sortBy}" ${sortDir}
                LIMIT $1 OFFSET $2
            )
            SELECT DistinctPosts.*,
                    likes."userId",
                    users."login",
                    likes."createdAt" as "addedAt" 
            FROM DistinctPosts 
            LEFT JOIN (
                SELECT *, ROW_NUMBER() OVER (PARTITION BY "postId" ORDER BY "createdAt" DESC) as row_num
                FROM public."LikesPosts"
                WHERE "status" = 'Like'
            ) as likes 
            ON DistinctPosts."id" = likes."postId" AND likes.row_num <= 3
            LEFT JOIN public."Users" as users 
            ON likes."userId" = users."id"
            ORDER BY DistinctPosts."${sortBy}" ${sortDir}, likes."createdAt" DESC
        `;

        const posts = await this.dataSourse.query(mainQuery, [pageSize, offset, blogId]);
        const outputPosts = postsOutputModel(posts);
        const pagesCount = Math.ceil(totalCount / pageSize);
        
        return {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: outputPosts
        }; 
    }
    async getPostForChange(blogId: string, postId: string){
        const result = await this.postRepository.findOneBy({id: postId, blogId: blogId});
        return result;
    }
}
