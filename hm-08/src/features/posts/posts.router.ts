import express, { Response, Request, NextFunction } from "express";
import { HTTP_STATUSES } from "../../utils";
import { URIParamsPostIdModel } from "./models/URIParamsPostIdModel";
import { postsService } from "../../domain/posts-service";
import { postsQueryRepo } from "../../repositories/postsQueryRepository"
import { PostType, PostsWithQueryType, RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithParamsAndBodyAndUserId, RequestWithParamsAndQuery, RequestWithQuery, UserOutputType } from "../../types/types";
import { authenticateUser } from "../../middlewares/authenticateUser-middleware";
import { inputValidationMiddleware, postCreateValidator, postUpdateValidator } from "../../middlewares/posts-bodyValidation-middleware";
import { CreatePostModel } from "./models/CreatePostModel";
import { postQueryValidationMiddleware, postQueryValidator } from "../../middlewares/posts-queryValidation-middleware";
import { CommentQueryType, PostQueryType, commentQueryParams, postQueryParams } from "../../assets/queryStringModifiers";
import { accessTokenGuard } from "../../middlewares/access-token-guard-middleware";
import { commentCreateValidator } from "../../middlewares/comments-bodyValidation-middleware";
import { CreateCommentModel } from "../comments/models/CreateCommentModel";
import { commentsQueryValidator } from "../../middlewares/comments-queryValidation-middleware";
import { userQueryValidationMiddleware } from "../../middlewares/users-queryValidation-middleware";
import { commentsQueryRepo } from "../../repositories/commentsQueryRepository";
import { commentsService } from "../../domain/comments-service";


export const getPostsRouter = () => {
    const router = express.Router();

    router.get('/', 
        ...postQueryValidator,
        postQueryValidationMiddleware,
        async (req: RequestWithQuery<Partial<PostQueryType>>, res: Response<PostsWithQueryType>) => {
        const response = await postsQueryRepo.getPosts(postQueryParams(req.query));
        res.status(HTTP_STATUSES.OK_200).json(response)
    })
    router.post('/', 
        authenticateUser,
        ...postCreateValidator,
        inputValidationMiddleware,
        async (req: RequestWithBody<CreatePostModel>, res: Response<PostType>) => {
        const createdBlog = await postsService.createPost(req.body);
        res.status(HTTP_STATUSES.CREATED_201).json(createdBlog);
    })
    router.get('/:id', async (req: RequestWithParams<URIParamsPostIdModel>,
        res: Response<PostType>) => {
        const foundBlog = await postsQueryRepo.getPostById(req.params.id);
        if (!foundBlog) {
            return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }

        res.json(foundBlog)
    })
    router.put('/:id', 
        authenticateUser,
        ...postUpdateValidator,
        inputValidationMiddleware,
        async (req: RequestWithParamsAndBody<URIParamsPostIdModel, Partial<PostType>>, 
        res: Response) => {
            const isUpdated = await postsService.updatePost(req.params.id, req.body);
            isUpdated ? res.send(HTTP_STATUSES.NO_CONTENT_204) : res.send(HTTP_STATUSES.NOT_FOUND_404)
    }) 
    router.delete('/:id', 
        authenticateUser,
        async (req: RequestWithParams<URIParamsPostIdModel>,res: Response) => {
            const isDeleted = await postsService.deletePost(req.params.id)
            if(isDeleted){
                res.send(HTTP_STATUSES.NO_CONTENT_204)
            }else{
                res.send(HTTP_STATUSES.NOT_FOUND_404)
            }   
    })
    router.post('/:id/comments',
        accessTokenGuard,
        commentCreateValidator,
        inputValidationMiddleware,
        async (req: RequestWithParamsAndBodyAndUserId<URIParamsPostIdModel,CreateCommentModel,UserOutputType>, 
                res:Response) => {
            const post = await postsQueryRepo.getPostById(req.params.id)
            if(!post) return res.send(HTTP_STATUSES.NOT_FOUND_404);
            const createdComment = await commentsService.createComment(req.params.id, req.body.content, req.user!);
            res.status(HTTP_STATUSES.CREATED_201).json(createdComment);
        })
    router.get('/:id/comments',
        ...commentsQueryValidator,
        userQueryValidationMiddleware,
        async(req: RequestWithParamsAndQuery<URIParamsPostIdModel,Partial<CommentQueryType>>, 
                res: Response) => {
            const post = await postsQueryRepo.getPostById(req.params.id)
            if(!post) return res.send(HTTP_STATUSES.NOT_FOUND_404);
            const comments = await commentsQueryRepo.getCommentsByPostId(req.params.id, commentQueryParams(req.query))  
            res.status(HTTP_STATUSES.OK_200).json(comments)
        })

    return router;
}