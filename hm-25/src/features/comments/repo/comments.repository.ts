import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentOutputModel } from '../api/models/output/comment.output.model';
import { Comment } from '../domain/comment.entity';
import { CommentSQL, myStatus } from '../types/types';
import { Result, ResultCode } from '../../../common/types/types';

@Injectable()
export class CommentsRepository {
  constructor(@InjectRepository(Comment) private readonly commentsRepository: Repository<Comment>) { }

  async createComment(newComment: CommentSQL): Promise<CommentOutputModel> {
    const createdComment = await this.commentsRepository.save(newComment);

    const mainData = await this.commentsRepository
      .createQueryBuilder("comment")
      .leftJoin("comment.user", "user")
      .where("comment.id = :id", { id: createdComment.id })
      .select(["comment.*", `user.login as "userLogin"`])
      .getRawOne();

    return this._mapCreatedCommentToOutputView(mainData);
  }
  async deleteComment(id: string): Promise<Result> {
    const result = await this.commentsRepository.delete(id);
    return result.affected === 1 ? {code: ResultCode.Success} : {code: ResultCode.NotFound};
  }
  async updateComment(id: string, content: string): Promise<Result> {
      const result = await this.commentsRepository.update(id, {content});
      return result.affected === 1 ? {code: ResultCode.Success} : {code: ResultCode.NotFound};
  }
  async deleteAllData() {
    const result = await this.commentsRepository
    .createQueryBuilder()
    .delete()
    .execute();
  }
  _mapCreatedCommentToOutputView(comment): CommentOutputModel {
    return {
      id: comment.id,
      content: comment.content,
      commentatorInfo: {
        userId: comment.userId,
        userLogin: comment.userLogin
      },
      createdAt: comment.createdAt,
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: myStatus.None
      }
    }
  }
}

