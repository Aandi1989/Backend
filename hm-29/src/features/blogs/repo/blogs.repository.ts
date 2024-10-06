import { Injectable } from "@nestjs/common";
import { BlogType } from "../types/types";
import { CreateBlogModel } from "../api/models/input/create-blog.input.model";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { BanUserModel } from "../../users/api/models/input/ban-user.input.model";
import { BanBlogForUserModel } from "../api/models/input/ban-blog-for-user.input";


@Injectable()
export class BlogsRepository {
    constructor(@InjectDataSource() protected dataSourse: DataSource) { }

    async createBlog(newBlog: BlogType): Promise<BlogType> {
        const { id, name, description, websiteUrl, createdAt, isMembership , ownerId } = newBlog;

        let queryFields = `"id", "name", "description", "websiteUrl", "createdAt", "isMembership"`;
        let queryValues = `'${id}', '${name}', '${description}', '${websiteUrl}', '${createdAt}', '${isMembership}'`;

        if (ownerId) {
            queryFields += `, "ownerId"`;
            queryValues += `, '${ownerId}'`;
        }

        const query = `
        INSERT INTO public."Blogs"(${queryFields})
        VALUES (${queryValues})
        RETURNING "id", "name", "description", "websiteUrl", "createdAt", "isMembership" ;
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

    async bindBlog(blogId: string, userId: string){
        const query = `
            UPDATE public."Blogs"
            SET "ownerId" = $1
            WHERE "id" = $2
        `;
        const result = await this.dataSourse.query(query, [userId, blogId])
        return result[1] === 1;
    }

    async banUserForBlog(userId: string, body: BanBlogForUserModel){
        const { banReason, isBanned, blogId } = body;

        const existingBanQuery = `
            SELECT * FROM public."BlogBans"
            WHERE "blogId" = $1 AND "userId" = $2;
        `;

        const existingBan = await this.dataSourse.query(existingBanQuery, [blogId, userId]);

        if(isBanned){
            // Optionally update the existing ban if needed
            if(existingBan.length > 0){
                const updateBanQuery = `
                    UPDATE public."BlogBans"
                    SET "bannedAt" = $1, "banReason" = $2
                    WHERE "blogId" = $3 AND "userId" = $4
                    RETURNING *;
                `;
                const banDate = new Date().toISOString();
                await this.dataSourse.query(updateBanQuery, [banDate, banReason, blogId, userId])
            }else{
                // Insert new ban
                const banDate = new Date().toISOString();
                const banQuery = `
                    INSERT INTO public."BlogBans"(
                        "blogId", "userId", "bannedAt", "banReason")
                    VALUES($1, $2, $3, $4)
                    RETURNING *;
                `;
                await this.dataSourse.query(banQuery, [blogId, userId, banDate, banReason]);
            }
        }else{
            const unbanQuery = `
                DELETE FROM public."BlogBans"
                WHERE "blogId" = $1 AND "userId" = $2;
            `;
            await this.dataSourse.query(unbanQuery, [blogId, userId]);
        }
        return true;
    }

    async deleteBlog(id: string): Promise<boolean> {
        const query = 
            `DELETE FROM public."Blogs"
            WHERE "id" = $1`;
        const result = await this.dataSourse.query(query, [id]);
        return result[1] === 1;
    }
    async deleteAllData() {
        const queryBlogs = `DELETE FROM public."Blogs"`;
        const queryBlogBans = `DELETE FROM public."BlogBans"`;
        const resultBlogBans = await this.dataSourse.query(queryBlogBans);
        const resultBlogs = await this.dataSourse.query(queryBlogs);
    }
}


/*
accessTokens:
Jan:  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhMjJkMjkwMi1mZTE1LTQ1N2UtOTJkYS1lMzI5MzI2N2I2ZTQiLCJpYXQiOjE3MTI5MzE4MDQsImV4cCI6MTcxNTYxMDIwNH0.UYSx026U3TH_Fu3BHkLOEuMGmHCgEqo2sEXS55-b1ng
John: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyMWFlNGUzNy1jN2I3LTQ1MzQtOTYzZS0xOTU2MDkwMmM0OTkiLCJpYXQiOjE3MTI5Mjg5OTMsImV4cCI6MTcxNTYwNzM5M30.S_d1MO5DsLdFKRD-92vHzrVcrwvMmB6hiavxQF3BnJI
Anna: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ZWYyZDVmYy1kODExLTRhYzAtOWEwZS03YzljZGEwODEyMmMiLCJpYXQiOjE3MTI5MzE4MzksImV4cCI6MTcxNTYxMDIzOX0.j50dDufNNN_O5_VyWd12MHFUf3KRukYmW_-CRy2Nnwc
Fabi: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0MDg4Y2UxOS0wZDlhLTRlMzEtOTY0NS1lYTk3OWFjMTE2ZWYiLCJpYXQiOjE3MTI5MzE4ODUsImV4cCI6MTcxNTYxMDI4NX0.W5HgISir--rHNfGR0N-retp6xzQq_S6jaeEYpC90j30
*/
