import express, { Response, Request, NextFunction } from "express";
import { DBType, PostType } from "../../db/db";
import { HTTP_STATUSES } from "../../utils";
import { URIParamsPostIdModel } from "./models/URIParamsPostIdModel";
import { postsRepository } from "../../repositories/posts-repository";
import { RequestWithBody, RequestWithParams } from "../../types";


export const getPostsRouter = () => {
    const router = express.Router();

    router.get('/', (req: Request, res: Response<PostType[]>) => {
        const posts = postsRepository.getPosts();
        res.status(HTTP_STATUSES.OK_200).json(posts)
    })
    
    router.get('/:id', (req: RequestWithParams<URIParamsPostIdModel>,
        res: Response<PostType>) => {
        const foundBlog = postsRepository.findPostById(req.params.id);
        if (!foundBlog) {
            return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }

        res.json(foundBlog)
    })

    return router;
}