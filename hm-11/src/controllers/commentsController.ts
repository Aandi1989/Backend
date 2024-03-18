import { Response, Router } from "express";
import { CommentsService } from "../domain/comments-service";
import { CreateCommentModel } from "../features/comments/models/CreateCommentModel";
import { URIParamsCommentIdModel } from "../features/comments/models/URIParamsCommentIdModel";
import { CommentsQueryRepo } from "../repositories/commentsQueryRepository";
import { RequestWithParams, RequestWithParamsAndUserId, UserOutputType, ResultCode, RequestWithParamsAndBodyAndUserId } from "../types/types";
import { HTTP_STATUSES } from "../utils";


export class CommentsController {
    constructor(protected commentsService: CommentsService,
                protected commentsQueryRepo: CommentsQueryRepo){}
    async getComment (req: RequestWithParams<URIParamsCommentIdModel>, res: Response) {
        const foundComment = await this.commentsQueryRepo.getCommentById(req.params.id);
        if (foundComment) return res.status(HTTP_STATUSES.OK_200).json(foundComment);
        return res.send(HTTP_STATUSES.NOT_FOUND_404);
    }
    async deleteComment (req: RequestWithParamsAndUserId<URIParamsCommentIdModel,UserOutputType>, res: Response) {
        const result = await this.commentsService.deleteComment(req.params.id,req.user!);
        if(result.code === ResultCode.NotFound) return res.send(HTTP_STATUSES.NOT_FOUND_404);
        if(result.code === ResultCode.Forbidden) return res.send(HTTP_STATUSES.ACCESS_FORBIDDEN_403);
        if(result.code === ResultCode.Success) return res.send(HTTP_STATUSES.NO_CONTENT_204);
    }
    async updateComment (req: RequestWithParamsAndBodyAndUserId<URIParamsCommentIdModel,CreateCommentModel,UserOutputType>, 
        res: Response) {
        const result = await this.commentsService.updateComment(req.params.id, req.body.content, req.user!);
        if(result.code === ResultCode.NotFound) return res.send(HTTP_STATUSES.NOT_FOUND_404);
        if(result.code === ResultCode.Forbidden) return res.send(HTTP_STATUSES.ACCESS_FORBIDDEN_403);
        if(result.code === ResultCode.Success) return res.send(HTTP_STATUSES.NO_CONTENT_204);
    }
}