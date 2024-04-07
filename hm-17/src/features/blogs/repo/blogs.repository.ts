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
    async updateBlog(id: string, data: Partial<CreateBlogModel>): Promise<boolean> {
        const {name, description, websiteUrl} = data;
        const query = 
                `UPDATE public."Blogs" 
                SET ` +
                (name ? `"name"='${name} '` : '') +
                (description ? `, "description"='${description}'` : '') +
                (websiteUrl ? `, "websiteUrl"='${websiteUrl} '` : '') +
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
        const query = `DELETE FROM public."Blogs`;
        const result = await this.dataSourse.query(query);
    }
}