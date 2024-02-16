import express,{ Response, Request, NextFunction } from "express";
import { BlogType, DBType } from "../../db/db";
import { HTTP_STATUSES } from "../../utils";
import { RequestWithParams } from "../../types"
import { URIParamsBlogIdModel } from "./models/URIParamsBlogIdModel";
import { blogsRepository } from "../../repositories/blogs-repository";


export const getBlogsRouter = (db: DBType)=> {
    const router = express.Router();

    router.get('/', (req: Request, res: Response<BlogType[]>) =>{
        res.status(HTTP_STATUSES.OK_200).json(db.blogs)
    })
    router.get('/:id', (req: RequestWithParams<URIParamsBlogIdModel>, 
                        res: Response<BlogType>) => {
            const foundBlog = blogsRepository.findBlogById(req.params.id);
            if(!foundBlog){
                return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            }

            res.json(foundBlog)
    })

    return router;
}