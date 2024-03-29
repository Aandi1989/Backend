import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Post, Put, Query, Res } from "@nestjs/common";
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
    async getBlogs(@Query() query: Partial<BlogQueryType>): Promise<BlogsWithQueryOutputModel>{
        return await this.blogsQueryRepo.getBlogs(blogQueryParams(query));
    }
    @Post()
    async createBlog (@Body() body: CreateBlogModel): Promise<BlogType>{
        return await this.blogsService.createBlog(body);

    }
    @Get(':id')
    async getBlog(@Param('id') blogId: string): Promise<BlogType>{
        const foundBlog = await this.blogsQueryRepo.findBlogById(blogId);
        if(!foundBlog) throw new NotFoundException('Blog not found');
        return foundBlog;
    }
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    @Put(':id')
    async updateBlog(@Param('id') blogId: string, @Body() body: Partial<CreateBlogModel>){
        const isUpdated = await this.blogsService.updateBlog(blogId, body);
        if(isUpdated) return;  
        throw new NotFoundException('Blog not found');
    }
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    @Delete(':id')
    async deleteBlog(@Param('id') blogId: string){
        const isDeleted = await this.blogsService.deleteBlog(blogId)
        if(isDeleted) return;
        throw new NotFoundException('Blog not found');
    }
    @Post(`:id/${RouterPaths.posts}`)
    async createPostForBlog(@Param('id') blogId: string, @Body() body: CreatePostModel): Promise<PostType | null>{
        const foundBlog = await this.blogsQueryRepo.findBlogById(blogId);
        if(!foundBlog) throw new NotFoundException('Blog not found');
        return await this.postsService.createPost(body, blogId);
    }
    @Get(`:id/${RouterPaths.posts}`)
    async getPostsForBlog(@Param('id') blogId: string, @Query() query:Partial<PostQueryType>): Promise<PostsWithQueryOutputModel>{
        const foundBlog = await this.blogsQueryRepo.findBlogById(blogId);
        if(!foundBlog) throw new NotFoundException('Blog not found');
        return await this.postsQueryRepo.getPostsByBlogId(blogId,postQueryParams(query));
    }
}