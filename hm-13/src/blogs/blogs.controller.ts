import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res } from "@nestjs/common";
import { HTTP_STATUSES, RouterPaths } from "src/utils";
import { BlogQueryType, BlogType, CreateBlogModel } from "./types/types";
import { blogQueryParams, postQueryParams } from "src/helpers/queryStringModifiers";
import { Response } from 'express';
import { BlogsQueryRepo } from "./repo/blogs.query.repository";
import { BlogsService } from "./service/blogs.service";
import { CreatePostModel, PostQueryType } from "src/posts/types/types";
import { PostsService } from "src/posts/service/posts.service";
import { PostsQueryRepo } from "src/posts/repo/posts.query.repository";

@Controller(RouterPaths.blogs)
export class BlogsController {
    constructor(protected blogsQueryRepo: BlogsQueryRepo,
                protected blogsService: BlogsService,
                protected postsService: PostsService,
                protected postsQueryRepo: PostsQueryRepo){}
    @Get()
    async getBlogs(@Query() query: Partial<BlogQueryType>, @Res() res: Response){
        const response = await this.blogsQueryRepo.getBlogs(blogQueryParams(query));
        return res.status(HTTP_STATUSES.OK_200).json(response)
    }
    @Post()
    async createBlog (@Body() body: CreateBlogModel, @Res() res: Response){
        const createdBlog = await this.blogsService.createBlog(body);
        return res.status(HTTP_STATUSES.CREATED_201).send(createdBlog);
    }
    @Get(':id')
    async getBlog(@Param('id') blogId: string, @Res() res: Response){
        const foundBlog = await this.blogsQueryRepo.findBlogById(blogId);
        if(!foundBlog) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return res.status(HTTP_STATUSES.OK_200).json(foundBlog)
    }
    @Put(':id')
    async updateBlog(@Param('id') blogId: string, @Body() body: Partial<BlogType>, @Res() res: Response){
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
    async createPostForBlog(@Param('id') blogId: string, @Body() body: CreatePostModel, @Res() res: Response){
        const foundBlog = await this.blogsQueryRepo.findBlogById(blogId);
        if(!foundBlog) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        const createdPost = await this.postsService.createPost(body, blogId);
        return res.status(HTTP_STATUSES.CREATED_201).json(createdPost);
    }
    @Get(`:id/${RouterPaths.posts}`)
    async getPostsForBlog(@Param('id') blogId: string, @Query() query:Partial<PostQueryType>, @Res() res: Response){
        const foundBlog = await this.blogsQueryRepo.findBlogById(blogId);
        if(!foundBlog) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        const response = await this.postsQueryRepo.getPostsByBlogId(blogId,postQueryParams(query));
        return res.status(HTTP_STATUSES.OK_200).send(response)
    }
}