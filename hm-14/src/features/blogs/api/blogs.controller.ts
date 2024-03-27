import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res } from "@nestjs/common";
import { BlogQueryType, BlogType } from "../types/types";
import { blogQueryParams, postQueryParams } from "src/common/helpers/queryStringModifiers";
import { Response } from 'express';
import { BlogsQueryRepo } from "../repo/blogs.query.repository";
import { BlogsService } from "../application/blogs.service";
import { PostQueryType, PostType } from "src/features/posts/types/types";
import { PostsService } from "src/features/posts/application/posts.service";
import { PostsQueryRepo } from "src/features/posts/repo/posts.query.repository";
import { RouterPaths, HTTP_STATUSES } from "src/common/utils/utils";
import { CreateBlogModel } from "./models/input/create-blog.input.model";
import { BlogsWithQueryOutputModel } from "./models/output/blog.output.model";
import { CreatePostModel } from "src/features/posts/api/models/input/create-post.input.model";
import { PostsWithQueryOutputModel } from "src/features/posts/api/models/output/post.output.model";

@Controller(RouterPaths.blogs)
export class BlogsController {
    constructor(protected blogsQueryRepo: BlogsQueryRepo,
                protected blogsService: BlogsService,
                protected postsService: PostsService,
                protected postsQueryRepo: PostsQueryRepo){}
    @Get()
    async getBlogs(@Query() query: Partial<BlogQueryType>, @Res() res): Promise<BlogsWithQueryOutputModel>{
        const response = await this.blogsQueryRepo.getBlogs(blogQueryParams(query));
        return res.status(HTTP_STATUSES.OK_200).send(response)
    }
    @Post()
    async createBlog (@Body() body: CreateBlogModel, @Res() res): Promise<BlogType>{
        const createdBlog = await this.blogsService.createBlog(body);
        return res.status(HTTP_STATUSES.CREATED_201).send(createdBlog);
    }
    @Get(':id')
    async getBlog(@Param('id') blogId: string, @Res() res): Promise<BlogType>{
        const foundBlog = await this.blogsQueryRepo.findBlogById(blogId);
        if(!foundBlog) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return res.status(HTTP_STATUSES.OK_200).json(foundBlog)
    }
    @Put(':id')
    async updateBlog(@Param('id') blogId: string, @Body() body: Partial<CreateBlogModel>, @Res() res: Response){
        const isUpdated = await this.blogsService.updateBlog(blogId, body);
        if(isUpdated) return res.send(HTTP_STATUSES.NO_CONTENT_204);  
        return res.send(HTTP_STATUSES.NOT_FOUND_404);
    }
    @Delete(':id')
    async deleteBlog(@Param('id') blogId: string, @Res() res: Response){
        const isDeleted = await this.blogsService.deleteBlog(blogId)
        if(isDeleted) return res.send(HTTP_STATUSES.NO_CONTENT_204);
        return res.send(HTTP_STATUSES.NOT_FOUND_404);  
    }
    @Post(`:id/${RouterPaths.posts}`)
    async createPostForBlog(@Param('id') blogId: string, @Body() body: CreatePostModel, @Res() res): Promise<PostType | null>{
        const foundBlog = await this.blogsQueryRepo.findBlogById(blogId);
        if(!foundBlog) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        const createdPost = await this.postsService.createPost(body, blogId);
        return res.status(HTTP_STATUSES.CREATED_201).json(createdPost);
    }
    @Get(`:id/${RouterPaths.posts}`)
    async getPostsForBlog(@Param('id') blogId: string, @Query() query:Partial<PostQueryType>, @Res() res): Promise<PostsWithQueryOutputModel>{
        const foundBlog = await this.blogsQueryRepo.findBlogById(blogId);
        if(!foundBlog) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        const response = await this.postsQueryRepo.getPostsByBlogId(blogId,postQueryParams(query));
        return res.status(HTTP_STATUSES.OK_200).send(response)
    }
}