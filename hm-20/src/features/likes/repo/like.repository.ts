import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LikeCommentStatus } from 'src/features/likes/entities/likeComment.entity';
import { myStatus } from 'src/features/posts/types/types';
import { Repository } from 'typeorm';
import { LikesComments, LikesPosts } from '../domain/likes.entity';
import { LikePostStatus } from '../entities/likePost.entity';

@Injectable()
export class LikesRepository {
    constructor(@InjectRepository(LikesComments) private readonly likesCommentsRepository: Repository<LikesComments>,
                @InjectRepository(LikesPosts) private readonly likesPostsRepository: Repository<LikesPosts>) { }

    async addLikePost(newLike: LikePostStatus){
        const result = await this.likesPostsRepository.save(newLike);
        return result;
    }
    async addLikeComment(newLike: LikeCommentStatus){
        const result = await this.likesCommentsRepository.save(newLike);
        return result;
    }
    async updateLikePost(id: string, newStatus: myStatus): Promise<boolean> {
       const result = await this.likesPostsRepository.update(id, {status: newStatus});
       return result.affected === 1;
    }
    async updateLikeComment(id: string, newStatus: myStatus): Promise<boolean> {
        const result = await this.likesCommentsRepository.update(id, {status: newStatus});
        return result.affected === 1;
    }
    async deleteAllData(){
        const commentsResult = await this.likesCommentsRepository.clear();
        const postsResult = await this.likesPostsRepository.clear();
      }
}