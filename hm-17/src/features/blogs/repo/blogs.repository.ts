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


/*
accessTokens:
Jan:  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhMjJkMjkwMi1mZTE1LTQ1N2UtOTJkYS1lMzI5MzI2N2I2ZTQiLCJpYXQiOjE3MTI5MzE4MDQsImV4cCI6MTcxNTYxMDIwNH0.UYSx026U3TH_Fu3BHkLOEuMGmHCgEqo2sEXS55-b1ng
John: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyMWFlNGUzNy1jN2I3LTQ1MzQtOTYzZS0xOTU2MDkwMmM0OTkiLCJpYXQiOjE3MTI5Mjg5OTMsImV4cCI6MTcxNTYwNzM5M30.S_d1MO5DsLdFKRD-92vHzrVcrwvMmB6hiavxQF3BnJI
Anna: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ZWYyZDVmYy1kODExLTRhYzAtOWEwZS03YzljZGEwODEyMmMiLCJpYXQiOjE3MTI5MzE4MzksImV4cCI6MTcxNTYxMDIzOX0.j50dDufNNN_O5_VyWd12MHFUf3KRukYmW_-CRy2Nnwc
Fabi: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0MDg4Y2UxOS0wZDlhLTRlMzEtOTY0NS1lYTk3OWFjMTE2ZWYiLCJpYXQiOjE3MTI5MzE4ODUsImV4cCI6MTcxNTYxMDI4NX0.W5HgISir--rHNfGR0N-retp6xzQq_S6jaeEYpC90j30
*/
