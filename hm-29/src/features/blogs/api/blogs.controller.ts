import { Controller, Delete, Get, HttpCode, NotFoundException, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { Request } from 'express';
import { BlogsService } from "../application/blogs.service";
import { BlogsQueryRepo } from "../repo/blogs.query.repository";
import { BlogQueryType, BlogType } from "../types/types";
import { BlogsWithQueryOutputModel } from "./models/output/blog.output.model";
import { AccessUserId } from "../../../common/guards/accessUserId";
import { blogQueryParams, postQueryParams } from "../../../common/helpers/queryStringModifiers";
import { HTTP_STATUSES, RouterPaths } from "../../../common/utils/utils";
import { PostsWithQueryOutputModel } from "../../posts/api/models/output/post.output.model";
import { PostsQueryRepo } from "../../posts/repo/posts.query.repository";
import { PostQueryType } from "../../posts/types/types";
import { UserBanParams } from "../../users/api/models/input/user-id.dto";
import { AuthGuard } from "../../../common/guards/auth.guard";
import { SubscribeBlogCommand } from "../application/use-case/subscribe-blog.use-case";
import { UnsubscribeBlogCommand } from "../application/use-case/unsubscribe-blog.use-case";

@Controller(RouterPaths.blogs)
export class BlogsController {
    constructor(protected blogsQueryRepo: BlogsQueryRepo,
                protected postsQueryRepo: PostsQueryRepo,
                private commandBus: CommandBus){}
    
    @UseGuards(AccessUserId)
    @Get()
    async getBlogs(@Req() req: Request, @Query() query: Partial<BlogQueryType>): Promise<BlogsWithQueryOutputModel>{
        return await this.blogsQueryRepo.getBlogs(blogQueryParams(query), req.userId);
    }
    @UseGuards(AccessUserId)
    @Get(':id')
    async getBlog(@Req() req: Request, @Param('id') blogId: string): Promise<BlogType>{
        const foundBlog = await this.blogsQueryRepo.findBlogWithoutOwnerIdById(blogId, req.userId);
        if(!foundBlog) throw new NotFoundException('Blog not found');
        return foundBlog;
    }
    @UseGuards(AccessUserId)
    @Get(`:id/${RouterPaths.posts}`)
    async getPostsForBlog(@Req() req: Request, @Param('id') blogId: string, 
        @Query() query:Partial<PostQueryType>): Promise<PostsWithQueryOutputModel>{
        const foundBlog = await this.blogsQueryRepo.findBlogById(blogId);
        if(!foundBlog || foundBlog.isBanned) throw new NotFoundException('Blog not found');
        return await this.postsQueryRepo.getPostsByBlogId(blogId,postQueryParams(query), req.userId!);
    } 
    @UseGuards(AuthGuard)
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    @Post(`:id/subscription`)
    async subscribeBlog(@Req() req: Request, @Param() params: UserBanParams){
        const foundBlog = await this.blogsQueryRepo.findBlogById(params.id);
        if(!foundBlog) throw new NotFoundException('Blog not found');
        return await this.commandBus.execute(new SubscribeBlogCommand(req.user.id, params.id));
    }

    @UseGuards(AuthGuard)
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    @Delete(`:id/subscription`)
    async unsubscribeBlog(@Req() req: Request, @Param() params: UserBanParams){
        const foundBlog = await this.blogsQueryRepo.findBlogById(params.id);
        if(!foundBlog) throw new NotFoundException('Blog not found');
        return await this.commandBus.execute(new UnsubscribeBlogCommand(req.user.id, params.id));
    }
}