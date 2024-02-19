import express, { Response, Request, NextFunction } from "express";
import { DBType, PostType } from "../../db/db";
import { HTTP_STATUSES } from "../../utils";
import { URIParamsPostIdModel } from "./models/URIParamsPostIdModel";
import { postsRepository } from "../../repositories/posts-repository";
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody } from "../../types";
import { authenticateUser } from "../../middlewares/authenticateUser-middleware";
import { inputValidationMiddleware, postCreateValidator, postUpdateValidator } from "../../middlewares/input-validation-middleware";
import { CreatePostModel } from "./models/CreatePostModel";


export const getPostsRouter = () => {
    const router = express.Router();

    router.get('/', (req: Request, res: Response<PostType[]>) => {
        const posts = postsRepository.getPosts();
        res.status(HTTP_STATUSES.OK_200).json(posts)
    })
    router.post('/', 
        authenticateUser,
        ...postCreateValidator,
        inputValidationMiddleware,
        (req: RequestWithBody<CreatePostModel>, res: Response<PostType>) => {
        const createdBlog = postsRepository.createPost(req.body);

        res.status(HTTP_STATUSES.CREATED_201).json(createdBlog);
    })
    router.get('/:id', (req: RequestWithParams<URIParamsPostIdModel>,
        res: Response<PostType>) => {
        const foundBlog = postsRepository.findPostById(req.params.id);
        if (!foundBlog) {
            return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }

        res.json(foundBlog)
    })
    router.put('/:id', 
        authenticateUser,
        ...postUpdateValidator,
        inputValidationMiddleware,
        (req: RequestWithParamsAndBody<URIParamsPostIdModel, Partial<PostType>>, 
        res: Response) => {
            const isUpdated = postsRepository.updatePost(req.params.id, req.body);
            isUpdated ? res.send(HTTP_STATUSES.NO_CONTENT_204) : res.send(HTTP_STATUSES.NOT_FOUND_404)
    }) 
    router.delete('/:id', 
        authenticateUser,
        (req: RequestWithParams<URIParamsPostIdModel>,res: Response) => {
            const isDeleted = postsRepository.deletePost(req.params.id)
            if(isDeleted){
                res.send(HTTP_STATUSES.NO_CONTENT_204)
            }else{
                res.send(HTTP_STATUSES.NOT_FOUND_404)
            }   
    })

    return router;
}