import { Controller, Get, NotFoundException, Param, Res, UseGuards } from "@nestjs/common";
import { Response } from 'express';
import { CommentsQueryRepo } from "../repo/comments.query.repository";
import { RouterPaths, HTTP_STATUSES } from "src/common/utils/utils";
import { CommentOutputModel } from "./models/output/comment.output.model";
import { UserId } from "src/common/guards/userId.guard";

@Controller(RouterPaths.comments)
export class CommentsController {
    constructor(protected commentsQueryRepo: CommentsQueryRepo){}
    @Get(':id')
    async getComment(@Param('id') commentId: string): Promise<CommentOutputModel>{
        const foundComment = await this.commentsQueryRepo.getCommentById(commentId);
        if (!foundComment) throw new NotFoundException('Comment not found');
        return foundComment;
    }
}
