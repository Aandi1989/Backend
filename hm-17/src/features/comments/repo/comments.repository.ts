import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from '../domain/comments.schema';
import { DBCommentType, myStatus } from '../types/types';
import { CommentOutputModel } from '../api/models/output/comment.output.model';
import { Result, ResultCode } from 'src/common/types/types';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name)
    private CommentModel: Model<Comment>,
  ) { }
  async createComment(newComment: DBCommentType): Promise<CommentOutputModel> {
    const result = await this.CommentModel.insertMany([newComment])
    return this._mapDBCommentTypeToCommentTypeAfterCreating(newComment)
  }
  async deleteAllData() {
    await this.CommentModel.deleteMany({});
  }
  async deleteComment(id: string): Promise<Result> {
    const result = await this.CommentModel.deleteOne({ id: id })
    if (result.deletedCount === 1) return {
      code: ResultCode.Success
    }
    return {
      code: ResultCode.NotFound
    }
  }
  async updateComment(id: string, content: string): Promise<Result>{
    const result = await this.CommentModel.updateOne(
        {id: id},
        { $set: {content: content}}
    );
    if(result.modifiedCount === 1) return {
        code: ResultCode.Success
    }
    return {
        code: ResultCode.NotFound
    }
}
  _mapDBCommentTypeToCommentTypeAfterCreating(comment: DBCommentType): CommentOutputModel {
    return {
      id: comment.id,
      content: comment.content,
      commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin
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