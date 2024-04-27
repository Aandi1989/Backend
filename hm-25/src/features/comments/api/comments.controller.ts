import { Body, Controller, Delete, ForbiddenException, Get, HttpCode, NotFoundException, Param, Put, Query, Req, Res, UseGuards } from "@nestjs/common";
import { Response, Request } from 'express';
import { CommentsQueryRepo } from "../repo/comments.query.repository";
import { CommentOutputModel } from "./models/output/comment.output.model";
import { CommandBus } from "@nestjs/cqrs";
import { DeleteCommentCommand } from "../application/use-case/delete-comment.use-case";
import { CreateCommentModel } from "./models/input/create-comment.input.model";
import { UpdateCommentCommand } from "../application/use-case/update-comment.use-case";
import { LikeCommentCommand } from "../../likes/application/use-cases/like-comment.use-case";
import { AccessUserId } from "../../../common/guards/accessUserId";
import { AuthGuard } from "../../../common/guards/auth.guard";
import { ResultCode } from "../../../common/types/types";
import { RouterPaths, HTTP_STATUSES } from "../../../common/utils/utils";
import { SetStatusModel } from "../../likes/api/models/input/set-status.input.model";


@Controller(RouterPaths.comments)
export class CommentsController {
    constructor(protected commentsQueryRepo: CommentsQueryRepo,
                private commandBus: CommandBus){}
    @UseGuards(AccessUserId)
    @Get(':id')
    async getComment(@Req() req: Request, @Param('id') commentId: string): Promise<CommentOutputModel>{
        const foundComment = await this.commentsQueryRepo.getCommentById(commentId, req.userId!);
        if (!foundComment) throw new NotFoundException('Comment not found');
        return foundComment;
    }
    @UseGuards(AuthGuard)
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    @Delete(':id')
    async deleteComment(@Req() req: Request, @Param('id') commentId: string){
        const result = await this.commandBus.execute(new DeleteCommentCommand(commentId, req.user!));
        if(result.code === ResultCode.NotFound) throw new NotFoundException();
        if(result.code === ResultCode.Forbidden) throw new ForbiddenException();
        return;
    }
    @UseGuards(AuthGuard)
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    @Put(':id')
    async updateComment(@Req() req: Request, @Param('id') commentId: string, @Body() body: CreateCommentModel){
        const result = await this.commandBus.execute(new UpdateCommentCommand(commentId, body.content, req.user!));
        if(result.code === ResultCode.NotFound) throw new NotFoundException();
        if(result.code === ResultCode.Forbidden) throw new ForbiddenException();
        return;
    }
    @UseGuards(AuthGuard)
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    @Put(':id/like-status')
    async likeComment(@Req() req: Request, @Param('id') commentId: string, @Body() body: SetStatusModel){
        const result = await this.commandBus.execute(new LikeCommentCommand(commentId, body.likeStatus, req.user!.id));
        if(result.code === ResultCode.NotFound) throw new NotFoundException();
        return;
    }
}
