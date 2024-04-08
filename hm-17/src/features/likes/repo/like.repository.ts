import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Like } from '../domain/likes.schema';
import { LikeStatus } from 'src/features/likes/entities/like';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class LikesRepository {
    constructor(
        @InjectDataSource() protected dataSourse: DataSource,
        // @InjectModel(Like.name)
        // private LikeModel: Model<Like>,
    ) { }

    // async addLike(newLike: LikeStatus){
    //     const result = await this.LikeModel.insertMany([newLike])
    //     return result;
    // }
    async addLike(newLike: LikeStatus){
        const { id, userId, parentId, status, createdAt } = newLike;
        const query = `
            INSERT INTO public."Likes"(
                "id", "userId", "parentId", "status", "createdAt")
                VALUES ('${id}', '${userId}', '${parentId}', '${status}', '${createdAt}');
        `;
        const result = await this.dataSourse.query(query);
        return result;
    }
    async deleteAllData(){
        const query = `DELETE FROM public."Likes`;
        const result = await this.dataSourse.query(query);
      }
}