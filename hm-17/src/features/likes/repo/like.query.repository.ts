import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Like } from "../domain/likes.schema";

@Injectable()
export class LikesQueryRepo {
    constructor(
        @InjectModel(Like.name)
        private LikeModel: Model<Like>
    ) { }
    async getLike(postId: string, userId: string){
        const result = await this.LikeModel.findOne({parentId: postId, userId: userId})
        return result;
    }
    async deleteAllData(){
        await this.LikeModel.deleteMany({});
      }
}