import express,{ Response, Request, NextFunction } from "express";
import { BlogType, DBType } from "../../db/db";
import { HTTP_STATUSES } from "../../utils";
import { RequestWithBody, RequestWithParams } from "../../types"
import { URIParamsBlogIdModel } from "./models/URIParamsBlogIdModel";
import { blogsRepository } from "../../repositories/blogs-repository";
import { CreateBlogModel } from "./models/CreateBlogModel";
import { blogPostValidator, inputValidationMiddleware } from "../../middlewares/input-validation-middleware";
import { authenticateUser } from "../../middlewares/authenticateUser-middleware";


export const getBlogsRouter = ()=> {
    const router = express.Router();

    router.get('/', (req: Request, res: Response<BlogType[]>) =>{
        const blogs = blogsRepository.getBlogs();
        res.status(HTTP_STATUSES.OK_200).json(blogs)
    })
    router.post('/', 
        authenticateUser,
        ...blogPostValidator,
        inputValidationMiddleware,
        (req: RequestWithBody<CreateBlogModel>, res: Response<BlogType>) => {
        const createdBlog = blogsRepository.createBlog(req.body);

        res.status(HTTP_STATUSES.CREATED_201).json(createdBlog);
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