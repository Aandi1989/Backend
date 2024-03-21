import { Router } from "express";
import { accessTokenGuard } from "../../middlewares/access-token-guard-middleware";
import { commentCreateValidator, likeStatusValidator } from "../../middlewares/comments-bodyValidation-middleware";
import { inputValidationMiddleware } from "../../middlewares/posts-bodyValidation-middleware";
import { CommentsController } from "../../controllers/commentsController";
import { container } from "../../composition-root";

const commentsController = container.resolve(CommentsController)

export const commentsRouter = Router();


commentsRouter.get('/:id', commentsController.getComment.bind(commentsController))
commentsRouter.delete('/:id', accessTokenGuard, commentsController.deleteComment.bind(commentsController))
commentsRouter.put('/:id', accessTokenGuard, commentCreateValidator, inputValidationMiddleware, 
    commentsController.updateComment.bind(commentsController))
commentsRouter.put('/:id/like-status', accessTokenGuard, likeStatusValidator, inputValidationMiddleware,
    commentsController.likeComment.bind(commentsController))
