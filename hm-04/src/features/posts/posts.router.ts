import express, { Response, Request, NextFunction } from "express";
import { HTTP_STATUSES } from "../../utils";
import { URIParamsPostIdModel } from "./models/URIParamsPostIdModel";
import { postsService } from "../../domain/posts-service";
import { postsQueryRepo } from "../../repositories/postsQueryRepository"
import { PostType, PostsWithQueryType, RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from "../../types";
import { authenticateUser } from "../../middlewares/authenticateUser-middleware";
import { inputValidationMiddleware, postCreateValidator, postUpdateValidator } from "../../middlewares/posts-validation-middleware";
import { CreatePostModel } from "./models/CreatePostModel";
import { postQueryValidationMiddleware, postQueryValidator } from "../../middlewares/posts-queryValidation-middleware";
import { PostQueryType, postQueryParams } from "../../assets/queryStringModifiers";


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

    return router;
}