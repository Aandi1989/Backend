import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Like } from '../domain/likes.schema';
import { LikeStatus } from 'src/features/likes/entities/like';
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
    async updateLikePost(id: string, newStatus: myStatus): Promise<boolean> {
        const query = 
                `UPDATE public."LikesPosts" 
                SET "status" = '${newStatus}' 
                WHERE "id" = '${id}'`;
        console.log(query);
        const result = await this.dataSourse.query(query);
        return result[1] === 1;
    }
    async deleteAllData(){
        const queryPosts = `DELETE FROM public."LikesPosts`;
        const resultPosts = await this.dataSourse.query(queryPosts);
        const queryComments = `DELETE FROM public."LikesComments`;
        const resultComments = await this.dataSourse.query(queryComments);
      }
}