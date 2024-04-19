import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { commentsOutputModel } from 'src/common/helpers/commentsOutoutModel';
import { Result, ResultCode } from 'src/common/types/types';
import { DataSource, Repository } from 'typeorm';
import { CommentOutputModel } from '../api/models/output/comment.output.model';
import { CommentSQL } from '../types/types';
import { Comment } from '../domain/comment.entity';

@Injectable()
export class CommentsRepository {
  constructor(@InjectDataSource() protected dataSourse: DataSource,
              @InjectRepository(Comment) private readonly commentRepository: Repository<Comment>) { }

  async createComment(newComment: CommentSQL): Promise<CommentOutputModel> {
    const { id, content, userId, postId, createdAt } = newComment;
    const query = `
            INSERT INTO public."Comments"(
                "id", "content", "userId", "postId", "createdAt")
                VALUES ('${id}', '${content}', '${userId}', '${postId}', '${createdAt}')
                RETURNING "id";
        `;
    const result = await this.dataSourse.query(query);
    const commentId = result[0].id;

    const mainQuery = `
          SELECT comments.*, users."login" as "userLogin"
          FROM  public."Comments" as comments
          LEFT JOIN public."Users" as users
          ON comments."userId" = users."id"
          WHERE comments."id" = '${commentId}'
    `;
    const mainResult = await this.dataSourse.query(mainQuery);
    const outputComment = commentsOutputModel(mainResult)[0]

    return outputComment;
  }
  async deleteComment(id: string): Promise<Result> {
    const query =
      `DELETE FROM public."Comments"
            WHERE "id" = $1`;
    const result = await this.dataSourse.query(query, [id]);
    if (result[1] === 1) return {
      code: ResultCode.Success
    }
    return {
      code: ResultCode.NotFound
    }
  }
  async updateComment(id: string, content: string): Promise<Result> {
    const query = `
      UPDATE public."Comments"
      SET "content" = '${content}'
      WHERE "id" = $1`;
    const result = await this.dataSourse.query(query, [id]);
    if (result[1] === 1) return {
      code: ResultCode.Success
    }
    return {
      code: ResultCode.NotFound
    }
  }
  async deleteAllData() {
    const query = `DELETE FROM public."Comments"`;
    const result = await this.dataSourse.query(query);
  }
}

