import { Response, Router } from "express";
import { BlogQueryType, PostQueryType, blogQueryParams, postQueryParams } from "../../assets/queryStringModifiers";
import { blogsService } from "../../domain/blogs-service";
import { postsService } from "../../domain/posts-service";
import { authenticateUser } from "../../middlewares/authenticateUser-middleware";
import { blogIdValidationMiddleware, blogIdValidator } from "../../middlewares/blogId-paramsValidation-middleware";
import { blogPostValidator, blogUpdateValidator, inputValidationMiddleware } from "../../middlewares/blogs-bodyValidation-middleware";
import { blogQueryValidationMiddleware, blogQueryValidator } from "../../middlewares/blogs-queryValidation-middleware";
import { postCreateWithoutBlogIdValidator, inputValidationMiddleware as postInputValidationMiddleware } from "../../middlewares/posts-bodyValidation-middleware";
import { postQueryValidationMiddleware, postQueryValidator } from "../../middlewares/posts-queryValidation-middleware";
import { blogsQueryRepo } from "../../repositories/blogsQueryRepository";
import { postsQueryRepo } from "../../repositories/postsQueryRepository";
import {
    BlogType, BlogsWithQueryType, PostType, PostsWithQueryType, RequestWithBody,
    RequestWithParams, RequestWithParamsAndBody, RequestWithParamsAndQuery, RequestWithQuery
} from "../../types/types";
import { HTTP_STATUSES } from "../../utils";
import { CreatePostModel } from "../posts/models/CreatePostModel";
import { CreateBlogModel } from "./models/CreateBlogModel";
import { URIParamsBlogIdModel } from "./models/URIParamsBlogIdModel";
import { URIParamsIdModel } from "./models/URIParamsIdModel";

export const blogsRouter = Router();

class BlogsController {
    async getBlogs (req: RequestWithQuery<Partial<BlogQueryType>>, res: Response<BlogsWithQueryType>) {
        const response = await blogsQueryRepo.getBlogs(blogQueryParams(req.query));
        res.status(HTTP_STATUSES.OK_200).json(response)
    }
    async createBlog (req: RequestWithBody<CreateBlogModel>, res: Response<BlogType>) {
        const createdBlog = await blogsService.createBlog(req.body);
        res.status(HTTP_STATUSES.CREATED_201).json(createdBlog);
    }
    async getBlog (req: RequestWithParams<URIParamsIdModel>, res: Response<BlogType>) {
        const foundBlog = await blogsQueryRepo.findBlogById(req.params.id);
        if(!foundBlog) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return res.status(HTTP_STATUSES.OK_200).json(foundBlog)
    }
    async createPostForBlog (req: RequestWithParamsAndBody<URIParamsBlogIdModel,CreatePostModel>, res:Response<PostType>) {
        const foundBlog = await blogsQueryRepo.findBlogById(req.params.blogId);
        if(!foundBlog) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        const createdPost = await postsService.createPost(req.body, req.params);
        return res.status(HTTP_STATUSES.CREATED_201).json(createdPost);
    }
    async getPostsForBlog (req: RequestWithParamsAndQuery<URIParamsBlogIdModel,Partial<PostQueryType>>, 
                           res: Response<PostsWithQueryType>) {
        const foundBlog = await blogsQueryRepo.findBlogById(req.params.blogId);
        if(!foundBlog) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        const response = await postsQueryRepo.getPostsByBlogId(req.params.blogId,postQueryParams(req.query));
        return res.status(HTTP_STATUSES.OK_200).json(response)
    }
    async updateBlog (req: RequestWithParamsAndBody<URIParamsIdModel, Partial<BlogType>>, res: Response) {
            const isUpdated = await blogsService.updateBlog(req.params.id, req.body);
            if(isUpdated) return res.send(HTTP_STATUSES.NO_CONTENT_204);  
            return res.send(HTTP_STATUSES.NOT_FOUND_404);
    }
    async deleteBlog (req: RequestWithParams<URIParamsIdModel>,res: Response) {
        const isDeleted = await blogsService.deleteBlog(req.params.id)
        if(isDeleted) return res.send(HTTP_STATUSES.NO_CONTENT_204);
        return res.send(HTTP_STATUSES.NOT_FOUND_404); 
    }
}

const blogsController = new BlogsController();

blogsRouter.get('/', ...blogQueryValidator, blogQueryValidationMiddleware, blogsController.getBlogs)
blogsRouter.post('/', authenticateUser, ...blogPostValidator, inputValidationMiddleware, blogsController.createBlog)
blogsRouter.get('/:id', blogsController.getBlog)
blogsRouter.post('/:blogId/posts', authenticateUser, ...postCreateWithoutBlogIdValidator, blogIdValidator,
    postInputValidationMiddleware, blogIdValidationMiddleware, blogsController.createPostForBlog)
blogsRouter.get('/:blogId/posts', blogIdValidator, ...postQueryValidator, postQueryValidationMiddleware,
    blogIdValidationMiddleware, blogsController.getPostsForBlog)
blogsRouter.put('/:id', authenticateUser, ...blogUpdateValidator, inputValidationMiddleware, blogsController.updateBlog)
blogsRouter.delete('/:id', authenticateUser, blogsController.deleteBlog)
