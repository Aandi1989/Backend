import { Injectable } from '@nestjs/common';
import { PostSQL, PostType } from '../types/types';
import { CreatePostModel } from '../api/models/input/create-post.input.model';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { postsOutputModel } from 'src/common/helpers/postsOutputModel';

@Injectable()
export class PostsRepository {
    constructor( @InjectDataSource() protected dataSourse: DataSource) { }

    async createPost(newPost: PostSQL): Promise<PostType> {
        const { id, title, shortDescription, content, blogId, blogName, createdAt } = newPost;
        const query = `
            INSERT INTO public."Posts"(
                "id", "title", "shortDescription", "content", "blogId", "blogName", "createdAt")
                VALUES ('${id}', '${title}', '${shortDescription}', '${content}', '${blogId}', '${blogName}', '${createdAt}')
                RETURNING *;
        `;
        const result = await this.dataSourse.query(query);
        return postsOutputModel(result)[0];
    }
    async updatePost(id: string, data: Partial<CreatePostModel>): Promise<boolean> {
        const { title, shortDescription, content, blogId } = data;
        const query = 
                `UPDATE public."Posts" 
                SET ` +
                (title ? `"title"='${title} '` : '') +
                (shortDescription ? `, "shortDescription"='${shortDescription}'` : '') +
                (content ? `, "content"='${content}'` : '') +
                (blogId ? `, "blogId"='${blogId}'` : '') +
                `WHERE "id" = $1`;
        const result = await this.dataSourse.query(query, [id]);
        return result[1] === 1;
    }
    async deletePost(id: string): Promise<boolean> {
        const query = 
            `DELETE FROM public."Posts"
            WHERE "id" = $1`;
        const result = await this.dataSourse.query(query, [id]);
        return result[1] === 1;
    }
    async deleteAllData(){
        const query = `DELETE FROM public."Posts`;
        const result = await this.dataSourse.query(query);
    }
}