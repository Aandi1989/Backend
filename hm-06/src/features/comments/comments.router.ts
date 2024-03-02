import express, {Response} from "express";
import { RequestWithParams, RequestWithParamsAndBodyAndUserId, RequestWithParamsAndUserId, ResultCode, UserOutputType } from "../../types/types";
import { URIParamsCommentIdModel } from "./models/URIParamsCommentIdModel";
import { commentsQueryRepo } from "../../repositories/commentsQueryRepository";
import { HTTP_STATUSES } from "../../utils";
import { accessTokenGuard } from "../../middlewares/access-token-guard-middleware";
import { commentsService } from "../../domain/comments-service";
import { commentCreateValidator } from "../../middlewares/comments-bodyValidation-middleware";
import { inputValidationMiddleware } from "../../middlewares/blogs-bodyValidation-middleware";
import { CreateCommentModel } from "./models/CreateCommentModel";

export const getCommentsRouter = () => {
    const router = express.Router();

    router.get('/:id',
        async(req: RequestWithParams<URIParamsCommentIdModel>, res: Response) => {
            const foundComment = await commentsQueryRepo.getCommentById(req.params.id);
            foundComment 
            ?  res.status(HTTP_STATUSES.OK_200).json(foundComment) 
            : res.send(HTTP_STATUSES.NOT_FOUND_404);
    })
    router.delete('/:id',
        accessTokenGuard,
        async(req: RequestWithParamsAndUserId<URIParamsCommentIdModel,UserOutputType>, res: Response) => {
            const result = await commentsService.deleteComment(req.params.id,req.user!);
            if(result.code === ResultCode.NotFound) return res.send(HTTP_STATUSES.NOT_FOUND_404);
            if(result.code === ResultCode.Forbidden) return res.send(HTTP_STATUSES.ACCESS_FORBIDDEN_403);
            if(result.code === ResultCode.Success) return res.send(HTTP_STATUSES.NO_CONTENT_204);
    })
    router.put('/:id',
        accessTokenGuard,
        commentCreateValidator,
        inputValidationMiddleware,
        async(req: RequestWithParamsAndBodyAndUserId<URIParamsCommentIdModel,CreateCommentModel,UserOutputType>, 
                res: Response) => {
            const result = await commentsService.updateComment(req.params.id, req.body.content, req.user!);
            if(result.code === ResultCode.NotFound) return res.send(HTTP_STATUSES.NOT_FOUND_404);
            if(result.code === ResultCode.Forbidden) return res.send(HTTP_STATUSES.ACCESS_FORBIDDEN_403);
            if(result.code === ResultCode.Success) return res.send(HTTP_STATUSES.NO_CONTENT_204);
        }
    )

    return router;
}