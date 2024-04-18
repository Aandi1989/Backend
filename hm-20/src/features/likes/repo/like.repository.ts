import { Injectable } from '@nestjs/common';
import { LikeStatus } from 'src/features/likes/entities/like.entity';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { myStatus } from 'src/features/posts/types/types';

@Injectable()
export class LikesRepository {
    constructor(@InjectDataSource() protected dataSourse: DataSource) { }

    async addLikePost(newLike: LikeStatus){
        const { id, userId, parentId, status, createdAt } = newLike;
        const query = `
            INSERT INTO public."LikesPosts"(
                "id", "userId", "postId", "status", "createdAt")
                VALUES ('${id}', '${userId}', '${parentId}', '${status}', '${createdAt}');
        `;
        const result = await this.dataSourse.query(query);
        return result;
    }
    async addLikeComment(newLike: LikeStatus){
        const { id, userId, parentId, status, createdAt } = newLike;
        const query = `
            INSERT INTO public."LikesComments"(
                "id", "userId", "commentId", "status", "createdAt")
                VALUES ('${id}', '${userId}', '${parentId}', '${status}', '${createdAt}');
        `;
        const result = await this.dataSourse.query(query);
        return result;
    }
    async updateLikePost(id: string, newStatus: myStatus): Promise<boolean> {
        const query = 
                `UPDATE public."LikesPosts" 
                SET "status" = '${newStatus}' 
                WHERE "id" = '${id}'`;
        const result = await this.dataSourse.query(query);
        return result[1] === 1;
    }
    async updateLikeComment(id: string, newStatus: myStatus): Promise<boolean> {
        const query = 
                `UPDATE public."LikesComments" 
                SET "status" = '${newStatus}' 
                WHERE "id" = '${id}'`;
        const result = await this.dataSourse.query(query);
        return result[1] === 1;
    }
    async deleteAllData(){
        const queryPosts = `DELETE FROM public."LikesPosts"`;
        const resultPosts = await this.dataSourse.query(queryPosts);
        const queryComments = `DELETE FROM public."LikesComments"`;
        const resultComments = await this.dataSourse.query(queryComments);
      }
}