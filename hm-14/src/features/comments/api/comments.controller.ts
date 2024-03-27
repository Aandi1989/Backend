import { Controller, Get, Param, Res } from "@nestjs/common";
import { Response } from 'express';
import { CommentsQueryRepo } from "../repo/comments.query.repository";
import { RouterPaths, HTTP_STATUSES } from "src/common/utils/utils";
import { CommentsWithQueryOutputModel } from "./models/output/comment.output.model";

@Controller(RouterPaths.comments)
export class CommentsController {
    constructor(protected commentsQueryRepo: CommentsQueryRepo){}
    @Get(':id')
    async getComment(@Param('id') commentId: string, @Res() res): Promise<CommentsWithQueryOutputModel>{
        const foundComment = await this.commentsQueryRepo.getCommentById(commentId);
        if (foundComment) return res.status(HTTP_STATUSES.OK_200).json(foundComment);
        return res.send(HTTP_STATUSES.NOT_FOUND_404);
    }
}