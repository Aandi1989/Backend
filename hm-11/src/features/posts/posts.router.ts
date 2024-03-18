import { Response, Router } from "express";
import { CommentQueryType, PostQueryType, commentQueryParams, postQueryParams } from "../../assets/queryStringModifiers";
import { commentsService } from "../../domain/comments-service";
import { postsService } from "../../domain/posts-service";
import { accessTokenGuard } from "../../middlewares/access-token-guard-middleware";
import { authenticateUser } from "../../middlewares/authenticateUser-middleware";
import { commentCreateValidator } from "../../middlewares/comments-bodyValidation-middleware";
import { commentsQueryValidator } from "../../middlewares/comments-queryValidation-middleware";
import { inputValidationMiddleware, postCreateValidator, postUpdateValidator } from "../../middlewares/posts-bodyValidation-middleware";
import { postQueryValidationMiddleware, postQueryValidator } from "../../middlewares/posts-queryValidation-middleware";
import { userQueryValidationMiddleware } from "../../middlewares/users-queryValidation-middleware";
import { commentsQueryRepo } from "../../repositories/commentsQueryRepository";
import { postsQueryRepo } from "../../repositories/postsQueryRepository";
import { PostType, PostsWithQueryType, RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithParamsAndBodyAndUserId, RequestWithParamsAndQuery, RequestWithQuery, UserOutputType } from "../../types/types";
import { HTTP_STATUSES } from "../../utils";
import { CreateCommentModel } from "../comments/models/CreateCommentModel";
import { CreatePostModel } from "./models/CreatePostModel";
import { URIParamsPostIdModel } from "./models/URIParamsPostIdModel";

export const postsRouter = Router();

class PostsController {
    async getPosts (req: RequestWithQuery<Partial<PostQueryType>>, res: Response<PostsWithQueryType>) {
        const response = await postsQueryRepo.getPosts(postQueryParams(req.query));
        return res.status(HTTP_STATUSES.OK_200).json(response);
    }
    async createPost (req: RequestWithBody<CreatePostModel>, res: Response<PostType>) {
        const createdBlog = await postsService.createPost(req.body);
        return res.status(HTTP_STATUSES.CREATED_201).json(createdBlog);
    }
    async getPost (req: RequestWithParams<URIParamsPostIdModel>,res: Response<PostType>) {
        const foundBlog = await postsQueryRepo.getPostById(req.params.id);
        if (!foundBlog) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return res.status(HTTP_STATUSES.OK_200).json(foundBlog)
    }
    async updatePost (req: RequestWithParamsAndBody<URIParamsPostIdModel, Partial<PostType>>, res: Response) {
            const isUpdated = await postsService.updatePost(req.params.id, req.body);
            if(isUpdated) return res.send(HTTP_STATUSES.NO_CONTENT_204);
            return res.send(HTTP_STATUSES.NOT_FOUND_404);
    }
    async deletePost (req: RequestWithParams<URIParamsPostIdModel>,res: Response) {
        const isDeleted = await postsService.deletePost(req.params.id)
        if(isDeleted) return res.send(HTTP_STATUSES.NO_CONTENT_204);
        return res.send(HTTP_STATUSES.NOT_FOUND_404); 
    }
    async createCommentForPost (req: RequestWithParamsAndBodyAndUserId<URIParamsPostIdModel,CreateCommentModel,UserOutputType>, 
        res:Response) {
        const post = await postsQueryRepo.getPostById(req.params.id)
        if(!post) return res.send(HTTP_STATUSES.NOT_FOUND_404);
        const createdComment = await commentsService.createComment(req.params.id, req.body.content, req.user!);
        return res.status(HTTP_STATUSES.CREATED_201).json(createdComment);
    }
    async getCommentsForPost (req: RequestWithParamsAndQuery<URIParamsPostIdModel,Partial<CommentQueryType>>, 
        res: Response){
        const post = await postsQueryRepo.getPostById(req.params.id)
        if(!post) return res.send(HTTP_STATUSES.NOT_FOUND_404);
        const comments = await commentsQueryRepo.getCommentsByPostId(req.params.id, commentQueryParams(req.query))  
         return res.status(HTTP_STATUSES.OK_200).json(comments)
    }
}

const postsController = new PostsController();

postsRouter.get('/', ...postQueryValidator, postQueryValidationMiddleware, postsController.getPosts)
postsRouter.post('/', authenticateUser, ...postCreateValidator, inputValidationMiddleware, postsController.createPost)
postsRouter.get('/:id', postsController.getPost)
postsRouter.put('/:id', authenticateUser, ...postUpdateValidator, inputValidationMiddleware, postsController.updatePost)
postsRouter.delete('/:id', authenticateUser, postsController.deletePost)
postsRouter.post('/:id/comments', accessTokenGuard, commentCreateValidator, inputValidationMiddleware, 
    postsController.createCommentForPost)
postsRouter.get('/:id/comments', ...commentsQueryValidator, userQueryValidationMiddleware, postsController.getCommentsForPost)
