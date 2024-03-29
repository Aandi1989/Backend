import express, { Response, Request, NextFunction } from "express";
import { DBType, PostType } from "../../db/db";
import { HTTP_STATUSES } from "../../utils";
import { URIParamsPostIdModel } from "./models/URIParamsPostIdModel";
import { postsRepository } from "../../repositories/posts-db-repository";
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody } from "../../types";
import { authenticateUser } from "../../middlewares/authenticateUser-middleware";
import { inputValidationMiddleware, postCreateValidator, postUpdateValidator } from "../../middlewares/posts-validation-middleware";
import { CreatePostModel } from "./models/CreatePostModel";


export const getPostsRouter = () => {
    const router = express.Router();

    router.get('/', async (req: Request, res: Response<PostType[]>) => {
        const posts = await postsRepository.getPosts();
        res.status(HTTP_STATUSES.OK_200).json(posts)
    })
    router.post('/', 
        authenticateUser,
        ...postCreateValidator,
        inputValidationMiddleware,
        async (req: RequestWithBody<CreatePostModel>, res: Response<PostType>) => {
        const createdBlog = await postsRepository.createPost(req.body);
        delete createdBlog._id;
        res.status(HTTP_STATUSES.CREATED_201).json(createdBlog);
    })
    router.get('/:id', async (req: RequestWithParams<URIParamsPostIdModel>,
        res: Response<PostType>) => {
        const foundBlog = await postsRepository.findPostById(req.params.id);
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
            const isUpdated = await postsRepository.updatePost(req.params.id, req.body);
            isUpdated ? res.send(HTTP_STATUSES.NO_CONTENT_204) : res.send(HTTP_STATUSES.NOT_FOUND_404)
    }) 
    router.delete('/:id', 
        authenticateUser,
        async (req: RequestWithParams<URIParamsPostIdModel>,res: Response) => {
            const isDeleted = await postsRepository.deletePost(req.params.id)
            if(isDeleted){
                res.send(HTTP_STATUSES.NO_CONTENT_204)
            }else{
                res.send(HTTP_STATUSES.NOT_FOUND_404)
            }   
    })

    return router;
}