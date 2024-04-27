import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LikesComments, LikesPosts } from "../domain/likes.entity";

@Injectable()
export class LikesQueryRepo {
    constructor(@InjectRepository(LikesComments) private readonly likesCommentsRepository: Repository<LikesComments>,
                @InjectRepository(LikesPosts) private readonly likesPostsRepository: Repository<LikesPosts>) { }
    
    async getLikePost(postId: string, userId: string){
        const result = await this.likesPostsRepository.findOneBy({postId, userId});
        return result;
    }
    async getLikeComment(commentId: string, userId: string){
        const result = await this.likesCommentsRepository.findOneBy({commentId, userId})
        return result;
    }
}