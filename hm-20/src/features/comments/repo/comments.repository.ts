import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { commentsOutputModel } from 'src/common/helpers/commentsOutoutModel';
import { Result, ResultCode } from 'src/common/types/types';
import { DataSource, Repository } from 'typeorm';
import { CommentOutputModel } from '../api/models/output/comment.output.model';
import { CommentSQL, myStatus } from '../types/types';
import { Comment } from '../domain/comment.entity';

@Injectable()
export class CommentsRepository {
  constructor(@InjectRepository(Comment) private readonly commentsRepository: Repository<Comment>) { }

  async createComment(newComment: CommentSQL): Promise<CommentOutputModel> {
    const createdComment = await this.commentsRepository.save(newComment);

    const mainData = await this.commentsRepository
      .createQueryBuilder("comment")
      .leftJoin("comment.user", "user")
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
    const result = await this.commentsRepository.clear();
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

