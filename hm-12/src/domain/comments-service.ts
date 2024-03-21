import { ObjectId } from "mongodb";
import { CommentsRepository } from "../repositories/comments-db-repository";
import { CommentsQueryRepo } from "../repositories/commentsQueryRepository";
import { Result, ResultCode, UserOutputType, myStatus } from "../types/types";
import { setStatus } from "../assets/helperCommentStatus";
import { injectable } from 'inversify';

@injectable()
export class CommentsService {
    constructor(protected commentsRepository: CommentsRepository,
                protected commentsQueryRepo: CommentsQueryRepo){}
    async createComment(postId: string, content: string, user: UserOutputType){
        const newComment = {
            id: (+new Date()).toString(),
            content: content,
            postId: postId,
            commentatorInfo: {
                userId: user.id,
                userLogin: user.login
            },
            createdAt: new Date().toISOString(),
            likes: [],
            dislikes: [],
            _id: new ObjectId()
        }
        const createdComment = await this.commentsRepository.createComment(newComment)
        return createdComment;
    }
    async deleteComment(id: string, user: UserOutputType): Promise<Result> {
        const foundComment = await this.commentsQueryRepo.getCommentById(id);
        if(!foundComment) return {
            code: ResultCode.NotFound
        };
        if(foundComment.commentatorInfo.userId !== user.id) return {
            code: ResultCode.Forbidden
        }
        return await this.commentsRepository.deleteComment(id)
    }
    async updateComment(id: string, content: string, user: UserOutputType): Promise<Result>{
        const foundComment = await this.commentsQueryRepo.getCommentById(id);
        if(!foundComment) return {
            code: ResultCode.NotFound
        };
        if(foundComment.commentatorInfo.userId !== user.id) return {
            code: ResultCode.Forbidden
        }
        return await this.commentsRepository.updateComment(id, content)
    }
    async likeComment (commentId: string, myStatus: myStatus, userId: string): Promise<Result>{
        const foundComment = await this.commentsQueryRepo.getDBTypeCommentById(commentId)
        if(!foundComment) return { code: ResultCode.NotFound };
        const statusObj = setStatus(foundComment, myStatus, userId);
        if(!statusObj) return {code: ResultCode.Success};
        const newStatus = {
            id: (+new Date()).toString(),
            status: myStatus,
            userId: userId,
            parentId: commentId,
            createdAt: new Date().toISOString()
        }
        if(foundComment){
            foundComment.likes = statusObj.like === 'add' ?  [newStatus, ...foundComment.likes] : foundComment.likes;
            foundComment.likes = statusObj.like === 'remove' ? foundComment.likes.filter(like => like.userId != userId) : foundComment.likes;
            foundComment.dislikes = statusObj.dislike === 'add' ?  [newStatus, ...foundComment.dislikes] : foundComment.dislikes;
            foundComment.dislikes = statusObj.dislike === 'remove' ?  foundComment.dislikes.filter(dislike => dislike.userId != userId) : foundComment.dislikes;
            //@ts-ignore
            await foundComment.save()
        }
        return {code: ResultCode.Success}
    }
}
