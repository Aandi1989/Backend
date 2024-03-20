import { likesModel } from "../db/models";
import { Like } from "../features/comments/entities/like";

export class LikesRepository {
    async addLike(newLike: Like){
        const result = await likesModel.insertMany([newLike])
        return result;
    }
}