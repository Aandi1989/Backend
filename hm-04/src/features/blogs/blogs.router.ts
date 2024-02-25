import express, { Response } from "express";
import { BlogQueryType, PostQueryType, blogQueryParams, postQueryParams } from "../../assets/queryStringModifiers";
import { blogsService } from "../../domain/blogs-service";
import { authenticateUser } from "../../middlewares/authenticateUser-middleware";
import { blogQueryValidationMiddleware, blogQueryValidator } from "../../middlewares/blogs-queryValidation-middleware";
import { blogPostValidator, blogUpdateValidator, inputValidationMiddleware } from "../../middlewares/blogs-validation-middleware";
import { inputValidationMiddleware as postInputValidationMiddleware } from "../../middlewares/posts-validation-middleware";
import { blogsQueryRepo } from "../../repositories/blogsQueryRepository";
import { BlogType, BlogsWithQueryType, PostType, PostsWithQueryType, RequestWithBody, 
    RequestWithParams, RequestWithParamsAndBody, RequestWithParamsAndQuery, RequestWithQuery } from "../../types";
import { HTTP_STATUSES } from "../../utils";
import { CreateBlogModel } from "./models/CreateBlogModel";
import { URIParamsIdModel } from "./models/URIParamsIdModel";
import { CreatePostModel } from "../posts/models/CreatePostModel";
import { postCreateValidator } from "../../middlewares/posts-validation-middleware";
import { postsService } from "../../domain/posts-service";
import { URIParamsBlogIdModel } from "./models/URIParamsBlogIdModel";
import { blogIdValidationMiddleware, blogIdValidator } from "../../middlewares/blogId-paramsValidation-middleware";
import { postQueryValidationMiddleware, postQueryValidator } from "../../middlewares/posts-queryValidation-middleware";
import { postsQueryRepo } from "../../repositories/postsQueryRepository";


export const getBlogsRouter = ()=> {
    const router = express.Router();

    router.get('/', 
        ...blogQueryValidator,
        blogQueryValidationMiddleware,
        async (req: RequestWithQuery<Partial<BlogQueryType>>, res: Response<BlogsWithQueryType>) =>{
        const response = await blogsQueryRepo.getBlogs(blogQueryParams(req.query));
        res.status(HTTP_STATUSES.OK_200).json(response)
    })
    router.post('/', 
        authenticateUser,
        ...blogPostValidator,
        inputValidationMiddleware,
        async (req: RequestWithBody<CreateBlogModel>, res: Response<BlogType>) => {
        const createdBlog = await blogsService.createBlog(req.body);
        res.status(HTTP_STATUSES.CREATED_201).json(createdBlog);
    })
    router.get('/:id', async (req: RequestWithParams<URIParamsIdModel>, 
                        res: Response<BlogType>) => {
            const foundBlog = await blogsQueryRepo.findBlogById(req.params.id);
            if(!foundBlog){
                return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            }

            res.json(foundBlog)
    })
    router.post('/:blogId/posts', 
    authenticateUser,
    ...postCreateValidator,
    blogIdValidator,
    postInputValidationMiddleware,
    blogIdValidationMiddleware,
    async (req: RequestWithParamsAndBody<URIParamsBlogIdModel,CreatePostModel>, res:Response<PostType>) =>{
        const foundBlog = await blogsQueryRepo.findBlogById(req.params.blogId);
        if(!foundBlog){
            return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
        const createdPost = await postsService.createPost(req.body, req.params);
        res.status(HTTP_STATUSES.CREATED_201).json(createdPost);
    })
    router.get('/:blogId/posts',
    blogIdValidator,
    ...postQueryValidator,
    postQueryValidationMiddleware,
    blogIdValidationMiddleware,
    async (req: RequestWithParamsAndQuery<URIParamsBlogIdModel,Partial<PostQueryType>>, res: Response<PostsWithQueryType>) => {
        const foundBlog = await blogsQueryRepo.findBlogById(req.params.blogId);
        if(!foundBlog){
            return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
        const response = await postsQueryRepo.getPostsByBlogId(req.params.blogId,postQueryParams(req.query));
        res.status(HTTP_STATUSES.OK_200).json(response)
    })
    router.put('/:id', 
        authenticateUser,
        ...blogUpdateValidator,
        inputValidationMiddleware,
        async (req: RequestWithParamsAndBody<URIParamsIdModel, Partial<BlogType>>, 
        res: Response) => {
            const isUpdated = await blogsService.updateBlog(req.params.id, req.body);
            isUpdated ? res.send(HTTP_STATUSES.NO_CONTENT_204) : res.send(HTTP_STATUSES.NOT_FOUND_404)
    }) 
    router.delete('/:id', 
        authenticateUser,
        async (req: RequestWithParams<URIParamsIdModel>,res: Response) => {
            const isDeleted = await blogsService.deleteBlog(req.params.id)
            if(isDeleted){
                res.send(HTTP_STATUSES.NO_CONTENT_204)
            }else{
                res.send(HTTP_STATUSES.NOT_FOUND_404)
            }   
    })

    return router;
}