import { Response, Router } from "express";
import { BlogQueryType, blogQueryParams, PostQueryType, postQueryParams } from "../assets/queryStringModifiers";
import { BlogsService } from "../domain/blogs-service";
import { PostsService } from "../domain/posts-service";
import { CreateBlogModel } from "../features/blogs/models/CreateBlogModel";
import { URIParamsBlogIdModel } from "../features/blogs/models/URIParamsBlogIdModel";
import { URIParamsIdModel } from "../features/blogs/models/URIParamsIdModel";
import { CreatePostModel } from "../features/posts/models/CreatePostModel";
import { BlogsQueryRepo } from "../repositories/blogsQueryRepository";
import { PostsQueryRepo } from "../repositories/postsQueryRepository";
import { RequestWithQuery, BlogsWithQueryType, RequestWithBody, BlogType, RequestWithParams, RequestWithParamsAndBody, PostType, RequestWithParamsAndQuery, PostsWithQueryType } from "../types/types";
import { HTTP_STATUSES } from "../utils";

export class BlogsController {
    constructor(protected blogsService: BlogsService,
                protected postsService: PostsService,
                protected blogsQueryRepo: BlogsQueryRepo,
                protected postsQueryRepo: PostsQueryRepo){}
    async getBlogs (req: RequestWithQuery<Partial<BlogQueryType>>, res: Response<BlogsWithQueryType>) {
        const response = await this.blogsQueryRepo.getBlogs(blogQueryParams(req.query));
        res.status(HTTP_STATUSES.OK_200).json(response)
    }
    async createBlog (req: RequestWithBody<CreateBlogModel>, res: Response<BlogType>) {
        const createdBlog = await this.blogsService.createBlog(req.body);
        res.status(HTTP_STATUSES.CREATED_201).json(createdBlog);
    }
    async getBlog (req: RequestWithParams<URIParamsIdModel>, res: Response<BlogType>) {
        const foundBlog = await this.blogsQueryRepo.findBlogById(req.params.id);
        if(!foundBlog) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return res.status(HTTP_STATUSES.OK_200).json(foundBlog)
    }
    async createPostForBlog (req: RequestWithParamsAndBody<URIParamsBlogIdModel,CreatePostModel>, res:Response<PostType>) {
        const foundBlog = await this.blogsQueryRepo.findBlogById(req.params.blogId);
        if(!foundBlog) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        const createdPost = await this.postsService.createPost(req.body, req.params);
        return res.status(HTTP_STATUSES.CREATED_201).json(createdPost);
    }
    async getPostsForBlog (req: RequestWithParamsAndQuery<URIParamsBlogIdModel,Partial<PostQueryType>>, 
                           res: Response<PostsWithQueryType>) {
        const foundBlog = await this.blogsQueryRepo.findBlogById(req.params.blogId);
        if(!foundBlog) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        const response = await this.postsQueryRepo.getPostsByBlogId(req.params.blogId,postQueryParams(req.query), req.user?.id);
        return res.status(HTTP_STATUSES.OK_200).json(response)
    }
    async updateBlog (req: RequestWithParamsAndBody<URIParamsIdModel, Partial<BlogType>>, res: Response) {
            const isUpdated = await this.blogsService.updateBlog(req.params.id, req.body);
            if(isUpdated) return res.send(HTTP_STATUSES.NO_CONTENT_204);  
            return res.send(HTTP_STATUSES.NOT_FOUND_404);
    }
    async deleteBlog (req: RequestWithParams<URIParamsIdModel>,res: Response) {
        const isDeleted = await this.blogsService.deleteBlog(req.params.id)
        if(isDeleted) return res.send(HTTP_STATUSES.NO_CONTENT_204);
        return res.send(HTTP_STATUSES.NOT_FOUND_404); 
    }
}