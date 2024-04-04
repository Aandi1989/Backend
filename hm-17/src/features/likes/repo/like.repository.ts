import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Like } from '../domain/likes.schema';
import { LikeStatus } from 'src/features/likes/entities/like';

@Injectable()
export class LikesRepository {
    constructor(
        @InjectModel(Like.name)
        private LikeModel: Model<Like>,
    ) { }

    async addLike(newLike: LikeStatus){
        const result = await this.LikeModel.insertMany([newLike])
        return result;
    }
    async deleteAllData(){
        await this.LikeModel.deleteMany({});
      }
}