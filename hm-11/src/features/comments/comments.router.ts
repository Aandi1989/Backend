import { Router } from "express";
import { commentsController } from "../../composition-root";
import { accessTokenGuard } from "../../middlewares/access-token-guard-middleware";
import { commentCreateValidator } from "../../middlewares/comments-bodyValidation-middleware";
import { inputValidationMiddleware } from "../../middlewares/posts-bodyValidation-middleware";


export const commentsRouter = Router();


commentsRouter.get('/:id', commentsController.getComment.bind(commentsController))
commentsRouter.delete('/:id', accessTokenGuard, commentsController.deleteComment.bind(commentsController))
commentsRouter.put('/:id', accessTokenGuard, commentCreateValidator, inputValidationMiddleware, 
    commentsController.updateComment.bind(commentsController))
