import { Injectable } from "@nestjs/common";
import { BlogType } from "../types/types";
import { CreateBlogModel } from "../api/models/input/create-blog.input.model";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";


@Injectable()
export class BlogsRepository {
    constructor(@InjectDataSource() protected dataSourse: DataSource) { }

    async createBlog(newBlog: BlogType): Promise<BlogType> {
        const { id, name, description, websiteUrl, createdAt, isMembership } = newBlog;
        const query = `
            INSERT INTO public."Blogs"(
                "id", "name", "description", "websiteUrl", "createdAt", "isMembership")
                VALUES ('${id}', '${name}', '${description}', '${websiteUrl}', '${createdAt}', '${isMembership}')
                RETURNING *;
        `;
        const result = await this.dataSourse.query(query);
        return result[0];
    }
    async updateBlog(id: string, data: CreateBlogModel): Promise<boolean> {
        const {name, description, websiteUrl} = data;
        const query = 
                `UPDATE public."Blogs" 
                SET ` +
                (name ? `"name"='${name}' ` : '') +
                (description ? `, "description"='${description}'` : '') +
                (websiteUrl ? `, "websiteUrl"='${websiteUrl}' ` : '') +
                `WHERE "id" = $1`;
        const result = await this.dataSourse.query(query, [id]);
        return result[1] === 1;
    }
    async deleteBlog(id: string): Promise<boolean> {
        const query = 
            `DELETE FROM public."Blogs"
            WHERE "id" = $1`;
        const result = await this.dataSourse.query(query, [id]);
        return result[1] === 1;
    }
    async deleteAllData() {
        const query = `DELETE FROM public."Blogs"`;
        const result = await this.dataSourse.query(query);
    }
}

// вариант сортировки который прошел тесты 
// const mainQuery = `
//         SELECT 
//             posts.*, 
//             likes."userId",
//             users."login",
//             likes."createdAt" as "addedAt",
//             (SELECT COUNT(*) 
//             FROM public."LikesPosts" 
//             WHERE "postId" = posts."id" AND "status" = 'Like') as "likesCount",
//             (SELECT COUNT(*) 
//             FROM public."LikesPosts" 
//             WHERE "postId" = posts."id" AND "status" = 'Dislike') as "dislikesCount",
//             ` +(userId ? `(SELECT likes."status"
//                             FROM public."LikesPosts" as likes
//                             WHERE likes."userId" = '${userId}' AND posts."id" = likes."postId") as "myStatus"` 
//                         : ` 'None' as "myStatus" `) +
//            ` FROM public."Posts" as posts
//         LEFT JOIN 
//             (SELECT *
//             FROM public."LikesPosts"
//             LIMIT 3) as likes
//         ON posts."id" = likes."postId"
//         LEFT JOIN 
//         public."Users" as users
//         ON likes."userId" = users."id"
//         WHERE  posts."blogId" = $3
//         ORDER BY posts."${sortBy}" ${sortDir}
//         LIMIT $1 OFFSET $2`
// вместо изначального !!!!!
// const mainQuery = `
//         SELECT 
//             posts.*, 
//             likes."userId",
//             users."login",
//             likes."createdAt" as "addedAt",
//             (SELECT COUNT(*) 
//             FROM public."LikesPosts" 
//             WHERE "postId" = posts."id" AND "status" = 'Like') as "likesCount",
//             (SELECT COUNT(*) 
//             FROM public."LikesPosts" 
//             WHERE "postId" = posts."id" AND "status" = 'Dislike') as "dislikesCount",
//             ` +(userId ? `(SELECT likes."status"
//                             FROM public."LikesPosts" as likes
//                             WHERE likes."userId" = '${userId}' AND posts."id" = likes."postId") as "myStatus"` 
//                         : ` 'None' as "myStatus" `) +
//            ` FROM public."Posts" as posts
//         LEFT JOIN 
//             (SELECT *
//             FROM public."LikesPosts"
//             LIMIT 3) as likes
//         ON posts."id" = likes."postId"
//         LEFT JOIN 
//         public."Users" as users
//         ON likes."userId" = users."id"
//         WHERE posts."id" IN (
//             SELECT id FROM public."Posts"
//             LIMIT $1
//             OFFSET $2
//         ) AND posts."blogId" = $3
//         ORDER BY posts."${sortBy}" ${sortDir}, likes."createdAt" ASC`

/*
изначальный вариант запроса за всеми постами 
SELECT 
            posts.*, 
            likes."userId",
            users."login",
            likes."createdAt" as "addedAt",
            (SELECT COUNT(*) 
            FROM public."LikesPosts" 
            WHERE "postId" = posts."id" AND "status" = 'Like') as "likesCount",
            (SELECT COUNT(*) 
            FROM public."LikesPosts" 
            WHERE "postId" = posts."id" AND "status" = 'Dislike') as "dislikesCount",
            ` +(userId ? `(SELECT likes."status"
                            FROM public."LikesPosts" as likes
                            WHERE likes."userId" = '${userId}' AND posts."id" = likes."postId") as "myStatus"` 
                        : ` 'None' as "myStatus" `) +
           ` FROM public."Posts" as posts
        LEFT JOIN 
            (SELECT *
            FROM public."LikesPosts"
            LIMIT 3) as likes
        ON posts."id" = likes."postId"
        LEFT JOIN 
        public."Users" as users
        ON likes."userId" = users."id"
        WHERE posts."id" IN (
            SELECT id FROM public."Posts"
            LIMIT $1
            OFFSET $2
        )
        ORDER BY posts."${sortBy}" ${sortDir}
        `
        // ORDER BY posts."${sortBy}" ${sortDir}, likes."createdAt" ASC`


Вариант который прошел тесты
 const mainQuery = `
        SELECT 
            posts.*, 
            likes."userId",
            users."login",
            likes."createdAt" as "addedAt",
            (SELECT COUNT(*) 
            FROM public."LikesPosts" 
            WHERE "postId" = posts."id" AND "status" = 'Like') as "likesCount",
            (SELECT COUNT(*) 
            FROM public."LikesPosts" 
            WHERE "postId" = posts."id" AND "status" = 'Dislike') as "dislikesCount",
            ` +(userId ? `(SELECT likes."status"
                            FROM public."LikesPosts" as likes
                            WHERE likes."userId" = '${userId}' AND posts."id" = likes."postId") as "myStatus"` 
                        : ` 'None' as "myStatus" `) +
           ` FROM public."Posts" as posts
        LEFT JOIN 
            (SELECT *
            FROM public."LikesPosts"
            LIMIT 3) as likes
        ON posts."id" = likes."postId"
        LEFT JOIN 
        public."Users" as users
        ON likes."userId" = users."id"
        ORDER BY posts."${sortBy}" ${sortDir}
        LIMIT $1 OFFSET $2
        `
*/