import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { commentsOutputModel } from 'src/common/helpers/commentsOutoutModel';
import { Repository } from 'typeorm';
import { CommentOutputModel, CommentsWithQueryOutputModel } from '../api/models/output/comment.output.model';
import { Comment } from '../domain/comment.entity';
import { CommentQueryOutputType } from '../types/types';

@Injectable()
export class CommentsQueryRepo {
    constructor(@InjectRepository(Comment) private readonly commentsRepository: Repository<Comment>) { }

    async getCommentsByPostId(postId: string, query: CommentQueryOutputType,
        userId: string = ''): Promise<CommentsWithQueryOutputModel> {
        const { pageNumber, pageSize, sortBy, sortDirection } = query;
        const sortDir = sortDirection === "asc" ? "ASC" : "DESC";
        const offset = (pageNumber - 1) * pageSize;

        const totalCount = await this.commentsRepository
            .createQueryBuilder("comment")
            .getCount();

        const comments = await this.commentsRepository
            .createQueryBuilder("comment")
            .leftJoin("comment.user", "user")
            .select([`comment.* , 
                (select COUNT(*) from "likes_comments" where "likes_comments"."commentId" = comment."id" AND "status" = 'Like') AS "likesCount",
                (select COUNT(*) from "likes_comments" where "likes_comments"."commentId" = comment."id" AND "status" = 'Dislike') AS "dislikesCount",
                user.login as "userLogin"
                `])
            .addSelect(`${userId}`  ?  `(SELECT "likes_comments"."status" FROM "likes_comments" WHERE "likes_comments"."userId" = :userId 
                                                                                AND "likes_comments"."commentId" = comment."id") "myStatus"`
                                    : `'None' AS "myStatus"`)
            .setParameter("userId", userId)
            .where("comment.postId = :postId", {postId})
            .orderBy(`comment.${sortBy}`, sortDir)
            .limit(pageSize)
            .offset(offset)
            .getRawMany();
        
        const pagesCount = Math.ceil(totalCount / pageSize);
        return {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: commentsOutputModel(comments)
        };
    }
    async getCommentById(id: string, userId: string = ''): Promise<CommentOutputModel | null> {
       
        const result = await this.commentsRepository
            .createQueryBuilder("comment")
            .leftJoin("comment.user", "user")
            .select([`comment.* , 
                (select COUNT(*) from "likes_comments" where "likes_comments"."commentId" = comment.id AND "status" = 'Like') AS "likesCount",
                (select COUNT(*) from "likes_comments" where "likes_comments"."commentId" = comment.id AND "status" = 'Dislike') AS "dislikesCount",
                user.login as "userLogin"
                `])
            .addSelect(`${userId}`  ?  `(SELECT "likes_comments"."status" FROM "likes_comments" WHERE "likes_comments"."userId" = :userId 
                                                                                AND "likes_comments"."commentId" = comment.id) "myStatus"`
                                    : `'None' AS "myStatus"`)
            .setParameter("userId", userId)
            .where("comment.id = :id", { id })
            .getRawOne();

        const outputComment = commentsOutputModel([result])
        return outputComment;
    }
    async getCommentWithoutLikesById(id :string){
        const result = await this.commentsRepository.findOneBy({id: id});
        return result;
    }
}

