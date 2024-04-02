import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from '../domain/comments.schema';
import { CommentQueryOutputType, DBCommentType, myStatus } from '../types/types';
import { CommentOutputModel, CommentsWithQueryOutputModel } from '../api/models/output/comment.output.model';

@Injectable()
export class CommentsQueryRepo {
    constructor(
        @InjectModel(Comment.name)
        private CommentModel: Model<Comment>,
    ) { }
    async getCommentsByPostId(postId: string, query: CommentQueryOutputType,
        userId: string = ''): Promise<CommentsWithQueryOutputModel> {
        const { pageNumber, pageSize, sortBy, sortDirection } = query;
        const sortDir = sortDirection == "asc" ? 1 : -1;
        const skip = (pageNumber - 1) * pageSize;
        const totalCount = await this.CommentModel.countDocuments({ postId: postId });
        const dbComments = await this.CommentModel
            .find({ postId: postId })
            .sort({ [sortBy]: sortDir })
            .skip(skip)
            .limit(pageSize)
            .lean() as DBCommentType[];
        const pagesCount = Math.ceil(totalCount / pageSize);
        return {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: dbComments.map(dbComment => {
                return this._mapDBCommentTypeToCommentType(dbComment, userId)
            })
        }
    }
    async getCommentById(id: string, userId: string = ''): Promise<CommentOutputModel | null> {
        let dbComment: DBCommentType | null = await this.CommentModel.findOne({ id: id })
        return dbComment ? this._mapDBCommentTypeToCommentType(dbComment, userId) : null;
    }
    _mapDBCommentTypeToCommentType(comment: DBCommentType, userId: string = ''): CommentOutputModel {
        return {
            id: comment.id,
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt,
            likesInfo: {
                // likesCount: comment.likes.length,
                // dislikesCount: comment.dislikes.length,
                // myStatus: defineStatus(comment, userId)
                likesCount: 0,
                dislikesCount: 0,
                myStatus: myStatus.None
            }
        }
    }
}