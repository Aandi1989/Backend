import { likesModel } from "../db/models";
import { Like } from "../features/comments/entities/like";

export class LikesQueryRepo {
    async getLike(postId: string, userId: string){
        const result = await likesModel.findOne({parentId: postId, userId: userId})
        return result;
    }
}