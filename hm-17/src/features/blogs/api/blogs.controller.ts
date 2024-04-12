import { Controller, Get, NotFoundException, Param, Query, Req, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { Request } from 'express';
import { AccessUserId } from "src/common/guards/accessUserId";
import { blogQueryParams, postQueryParams } from "src/common/helpers/queryStringModifiers";
import { RouterPaths } from "src/common/utils/utils";
import { PostsWithQueryOutputModel } from "src/features/posts/api/models/output/post.output.model";
import { PostsService } from "src/features/posts/application/posts.service";
import { PostsQueryRepo } from "src/features/posts/repo/posts.query.repository";
import { PostQueryType } from "src/features/posts/types/types";
import { BlogsService } from "../application/blogs.service";
import { BlogsQueryRepo } from "../repo/blogs.query.repository";
import { BlogQueryType, BlogType } from "../types/types";
import { BlogsWithQueryOutputModel } from "./models/output/blog.output.model";

@Controller(RouterPaths.blogs)
export class BlogsController {
    constructor(protected blogsQueryRepo: BlogsQueryRepo,
                protected blogsService: BlogsService,
                protected postsService: PostsService,
                protected postsQueryRepo: PostsQueryRepo,
                private commandBus: CommandBus){}
    @Get()
    async getBlogs(@Query() query: Partial<BlogQueryType>): Promise<BlogsWithQueryOutputModel>{
        return await this.blogsQueryRepo.getBlogs(blogQueryParams(query));
    }
    @Get(':id')
    async getBlog(@Param('id') blogId: string): Promise<BlogType>{
        const foundBlog = await this.blogsQueryRepo.findBlogById(blogId);
        if(!foundBlog) throw new NotFoundException('Blog not found');
        return foundBlog;
    }
    @UseGuards(AccessUserId)
    @Get(`:id/${RouterPaths.posts}`)
    async getPostsForBlog(@Req() req: Request, @Param('id') blogId: string, 
        @Query() query:Partial<PostQueryType>): Promise<PostsWithQueryOutputModel>{
        const foundBlog = await this.blogsQueryRepo.findBlogById(blogId);
        if(!foundBlog) throw new NotFoundException('Blog not found');
        return await this.postsQueryRepo.getPostsByBlogId(blogId,postQueryParams(query), req.userId!);
    } 
}