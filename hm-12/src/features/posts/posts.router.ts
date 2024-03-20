import { Router } from "express";
import { commentsController, postsController } from "../../composition-root";
import { accessTokenGuard } from "../../middlewares/access-token-guard-middleware";
import { authenticateUser } from "../../middlewares/authenticateUser-middleware";
import { commentCreateValidator, likeStatusValidator } from "../../middlewares/comments-bodyValidation-middleware";
import { commentsQueryValidator } from "../../middlewares/comments-queryValidation-middleware";
import { inputValidationMiddleware, postCreateValidator, postUpdateValidator } from "../../middlewares/posts-bodyValidation-middleware";
import { postQueryValidationMiddleware, postQueryValidator } from "../../middlewares/posts-queryValidation-middleware";
import { userQueryValidationMiddleware } from "../../middlewares/users-queryValidation-middleware";


export const postsRouter = Router();


postsRouter.get('/', ...postQueryValidator, postQueryValidationMiddleware, postsController.getPosts.bind(postsController))
postsRouter.post('/', authenticateUser, ...postCreateValidator, inputValidationMiddleware, 
    postsController.createPost.bind(postsController))
postsRouter.get('/:id', postsController.getPost.bind(postsController))
postsRouter.put('/:id', authenticateUser, ...postUpdateValidator, inputValidationMiddleware, 
    postsController.updatePost.bind(postsController))
postsRouter.delete('/:id', authenticateUser, postsController.deletePost.bind(postsController))
postsRouter.post('/:id/comments', accessTokenGuard, commentCreateValidator, inputValidationMiddleware, 
    postsController.createCommentForPost.bind(postsController))
postsRouter.get('/:id/comments', ...commentsQueryValidator, userQueryValidationMiddleware, 
    postsController.getCommentsForPost.bind(postsController))
postsRouter.put('/:id/like-status', accessTokenGuard, likeStatusValidator, inputValidationMiddleware,
    postsController.likePost.bind(postsController))
