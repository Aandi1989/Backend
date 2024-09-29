import { Controller, Get, NotFoundException, Param, Query, Req, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { Request } from 'express';
import { BlogsService } from "../application/blogs.service";
import { BlogsQueryRepo } from "../repo/blogs.query.repository";
import { BlogQueryType, BlogType } from "../types/types";
import { BlogsWithQueryOutputModel } from "./models/output/blog.output.model";
import { AccessUserId } from "../../../common/guards/accessUserId";
import { blogQueryParams, postQueryParams } from "../../../common/helpers/queryStringModifiers";
import { RouterPaths } from "../../../common/utils/utils";
import { PostsWithQueryOutputModel } from "../../posts/api/models/output/post.output.model";
import { PostsQueryRepo } from "../../posts/repo/posts.query.repository";
import { PostQueryType } from "../../posts/types/types";

@Controller(RouterPaths.blogs)
export class BlogsController {
    constructor(protected blogsQueryRepo: BlogsQueryRepo,
                protected postsQueryRepo: PostsQueryRepo,
                private commandBus: CommandBus){}
    @Get()
    async getBlogs(@Query() query: Partial<BlogQueryType>): Promise<BlogsWithQueryOutputModel>{
        return await this.blogsQueryRepo.getBlogs(blogQueryParams(query));
    }
    @Get(':id')
    async getBlog(@Param('id') blogId: string): Promise<BlogType>{
        const foundBlog = await this.blogsQueryRepo.findBlogWithoutOwnerIdById(blogId);
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