import express,{ Response, Request, NextFunction } from "express";
import { HTTP_STATUSES } from "../../utils";
import { BlogType, RequestWithBody, RequestWithParams, RequestWithParamsAndBody } from "../../types"
import { URIParamsBlogIdModel } from "./models/URIParamsBlogIdModel";
import { blogsService } from "../../domain/blogs-service";
import { blogsQueryRepo } from "../../repositories/blogsQueryRepository";
import { CreateBlogModel } from "./models/CreateBlogModel";
import { blogPostValidator, blogUpdateValidator, inputValidationMiddleware } from "../../middlewares/blogs-validation-middleware";
import { authenticateUser } from "../../middlewares/authenticateUser-middleware";


export const getBlogsRouter = ()=> {
    const router = express.Router();

    router.get('/', async (req: Request, res: Response<BlogType[]>) =>{
        const blogs = await blogsQueryRepo.getBlogs();
        res.status(HTTP_STATUSES.OK_200).json(blogs)
    })
    router.post('/', 
        authenticateUser,
        ...blogPostValidator,
        inputValidationMiddleware,
        async (req: RequestWithBody<CreateBlogModel>, res: Response<BlogType>) => {
        const createdBlog = await blogsService.createBlog(req.body);
        res.status(HTTP_STATUSES.CREATED_201).json(createdBlog);
    })
    router.get('/:id', async (req: RequestWithParams<URIParamsBlogIdModel>, 
                        res: Response<BlogType>) => {
            const foundBlog = await blogsQueryRepo.findBlogById(req.params.id);
            if(!foundBlog){
                return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            }

            res.json(foundBlog)
    })
    router.put('/:id', 
        authenticateUser,
        ...blogUpdateValidator,
        inputValidationMiddleware,
        async (req: RequestWithParamsAndBody<URIParamsBlogIdModel, Partial<BlogType>>, 
        res: Response) => {
            const isUpdated = await blogsService.updateBlog(req.params.id, req.body);
            isUpdated ? res.send(HTTP_STATUSES.NO_CONTENT_204) : res.send(HTTP_STATUSES.NOT_FOUND_404)
    }) 
    router.delete('/:id', 
        authenticateUser,
        async (req: RequestWithParams<URIParamsBlogIdModel>,res: Response) => {
            const isDeleted = await blogsService.deleteBlog(req.params.id)
            if(isDeleted){
                res.send(HTTP_STATUSES.NO_CONTENT_204)
            }else{
                res.send(HTTP_STATUSES.NOT_FOUND_404)
            }   
    })

    return router;
}