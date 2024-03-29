import { Router } from "express";
import { accessTokenGuard } from "../../middlewares/access-token-guard-middleware";
import { authenticateUser } from "../../middlewares/authenticateUser-middleware";
import { commentCreateValidator, likeStatusValidator } from "../../middlewares/comments-bodyValidation-middleware";
import { commentsQueryValidator } from "../../middlewares/comments-queryValidation-middleware";
import { inputValidationMiddleware, postCreateValidator, postUpdateValidator } from "../../middlewares/posts-bodyValidation-middleware";
import { postQueryValidationMiddleware, postQueryValidator } from "../../middlewares/posts-queryValidation-middleware";
import { userQueryValidationMiddleware } from "../../middlewares/users-queryValidation-middleware";
import { userDataFromAccessToken } from "../../middlewares/user-data-from-access-token-middleare";
import { PostsController } from "../../controllers/postsController";
import { container } from "../../composition-root";

const postsController = container.resolve(PostsController)

export const postsRouter = Router();


postsRouter.get('/', userDataFromAccessToken, ...postQueryValidator, postQueryValidationMiddleware, postsController.getPosts.bind(postsController))
postsRouter.post('/', authenticateUser, ...postCreateValidator, inputValidationMiddleware, 
    postsController.createPost.bind(postsController))
postsRouter.get('/:id', userDataFromAccessToken, postsController.getPost.bind(postsController))
postsRouter.put('/:id', authenticateUser, ...postUpdateValidator, inputValidationMiddleware, 
    postsController.updatePost.bind(postsController))
postsRouter.delete('/:id', authenticateUser, postsController.deletePost.bind(postsController))
postsRouter.post('/:id/comments', accessTokenGuard, commentCreateValidator, inputValidationMiddleware, 
    postsController.createCommentForPost.bind(postsController))
postsRouter.get('/:id/comments', userDataFromAccessToken, ...commentsQueryValidator, userQueryValidationMiddleware, 
    postsController.getCommentsForPost.bind(postsController))
postsRouter.put('/:id/like-status', accessTokenGuard, likeStatusValidator, inputValidationMiddleware,
    postsController.likePost.bind(postsController))
