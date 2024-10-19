import { Injectable } from '@nestjs/common';
import { PostSQL, PostType } from '../types/types';
import { CreatePostModel } from '../api/models/input/create-post.input.model';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { postsOutputModel } from '../../../common/helpers/postsOutputModel';
import { UpdatePostForBlogModel } from '../../blogs/api/models/input/update-post.input';
import { ImageType } from '../../blogs/types/types';


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
    async updatePost(id: string, data: UpdatePostForBlogModel): Promise<boolean> {
        const { title, shortDescription, content } = data;
        const query = 
                `UPDATE public."Posts" 
                SET ` +
                (title ? `"title"='${title}'` : '') +
                (shortDescription ? `, "shortDescription"='${shortDescription}'` : '') +
                (content ? `, "content"='${content}'` : '') +
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

    async upsertPostImage(image: ImageType){
        const { id, postId, url, width, height, fileSize, imageType } = image;
        const query = `
            INSERT INTO public."PostImages" (
                id, "postId", url, width, height, "fileSize", "imageType") 
            VALUES ('${id}', '${postId}', '${url}', ${width}, ${height}, ${fileSize}, '${imageType}')
            ON CONFLICT ("postId", "imageType") 
            DO UPDATE SET 
                url = EXCLUDED.url,
                width = EXCLUDED.width,
                height = EXCLUDED.height,
                "fileSize" = EXCLUDED."fileSize"
            RETURNING id;
        `;
        try{
            const result = await this.dataSourse.query(query);
            return result.length > 0;
        }catch(error){
            console.log('Error upserting post images:', error);
            return false;
        }
    }

    async deleteAllData(){
        const query = `DELETE FROM public."Posts"`;
        const result = await this.dataSourse.query(query);
    }
}