import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, HttpCode, NotFoundException, Param, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { HTTP_STATUSES, RouterPaths } from "../../../common/utils/utils";
import { CommandBus } from "@nestjs/cqrs";       
import { PostsQueryRepo } from "../../posts/repo/posts.query.repository";
import { BlogsQueryRepo } from "../repo/blogs.query.repository";
import { AuthGuard } from "../../../common/guards/auth.guard";
import { CreateBlogCommand } from "../application/use-case/create-blog.use-case";
import { BlogQueryType, BlogType } from "../types/types";
import { CreateBlogModel } from "./models/input/create-blog.input.model";
import { Request } from 'express';
import { UpdateOwnBlogCommand } from "../application/use-case/update-own-blog.use-case";
import { ResultCode } from "../../../common/types/types";
import { bannedUsersQueryParams, blogQueryParams, commentQueryParams, postQueryParams } from "../../../common/helpers/queryStringModifiers";
import { BlogsWithQueryOutputModel } from "./models/output/blog.output.model";
import { DeleteOwnBlogCommand } from "../application/use-case/delete-own-blog.use-case";
import { CreatePostForBlogCommand } from "../../posts/application/use-cases/create-post-for-blog.use-case";
import { CreatePostForBlogModel } from "./models/input/create-post-for-blog.model";
import { PostQueryType, PostType } from "../../posts/types/types";
import { UpdatePostForBlogModel } from "./models/input/update-post.input";
import { UpdateOwnPostCommand } from "../application/use-case/update-own-post.use-case";
import { PostsWithQueryOutputModel } from "../../posts/api/models/output/post.output.model";
import { DeleteOwnPostCommand } from "../application/use-case/delete-own-post.use-case";
import { UserBanParams } from "../../users/api/models/input/user-id.dto";
import { BlogsRepository } from "../repo/blogs.repository";
import { BanBlogForUserModel } from "./models/input/ban-blog-for-user.input";
import { BannedUsersQueryType } from "../../users/types/types";
import { UsersQueryRepo } from "../../users/repo/users.query.repository";
import { BannedUsersInfoOutputModel } from "../../users/api/models/output/user.output.model";
import { CommentQueryType } from "../../comments/types/types";
import { CommentsWithQueryOutputModel } from "../../comments/api/models/output/comment.output.model";
import { CommentsQueryRepo } from "../../comments/repo/comments.query.repository";
import * as fs from 'node:fs';
import { readFile, writeFile } from 'node:fs';
import * as path from 'node:path';
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadImageCommand } from "../application/use-case/save-blog-image.use-case";



@Controller(RouterPaths.blogger)
export class BloggerController {
    constructor(protected commandBus: CommandBus,
                protected blogsQueryRepo: BlogsQueryRepo,
                protected blogsRepository: BlogsRepository,
                protected postsQueryRepo: PostsQueryRepo,
                protected commentsQueryRepo: CommentsQueryRepo,
                protected usersQueryRepo: UsersQueryRepo){}
    @UseGuards(AuthGuard)
    @HttpCode(HTTP_STATUSES.CREATED_201)
    @Post('blogs')
    async createBlog (@Req() req: Request, @Body() body: CreateBlogModel): Promise<BlogType>{
        return await this.commandBus.execute(new CreateBlogCommand(body, req.user!));
    }

    @UseGuards(AuthGuard) 
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    @Put('blogs/:id')
    async updateBlog(@Req() req: Request, @Param('id') blogId: string, @Body() body: CreateBlogModel){
        const result = await this.commandBus.execute(new UpdateOwnBlogCommand( blogId, body, req.user!));
        if(result.code == ResultCode.Forbidden) throw new ForbiddenException();
        if(result.code == ResultCode.Success)  return; 
        throw new NotFoundException();
    }

    @UseGuards(AuthGuard)
    @Get('blogs')
    async getBlogs(@Req() req: Request, @Query() query: Partial<BlogQueryType>): Promise<BlogsWithQueryOutputModel>{
        return await this.blogsQueryRepo.getBloggerBlogs(blogQueryParams(query), req.user.id);
    }

    @UseGuards(AuthGuard) 
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    @Delete('blogs/:id')
    async deleteBlog(@Req() req: Request, @Param('id') blogId: string){
        const result = await this.commandBus.execute(new DeleteOwnBlogCommand(blogId, req.user!))
        if(result.code == ResultCode.Forbidden) throw new ForbiddenException();
        if(result.code == ResultCode.Success)  return; 
        throw new NotFoundException();
    }

    @UseGuards(AuthGuard)
    @HttpCode(HTTP_STATUSES.CREATED_201)
    @Post(`blogs/:id/${RouterPaths.posts}`)
    async createPostForBlog(@Req() req: Request, @Param('id') blogId: string, @Body() body: CreatePostForBlogModel): Promise<PostType | null>{
        const foundBlog = await this.blogsQueryRepo.findBlogById(blogId);
        if(!foundBlog) throw new NotFoundException();
        if(foundBlog.ownerId != req.user!.id) throw new ForbiddenException();
        return await this.commandBus.execute(new CreatePostForBlogCommand(body, blogId));
    }

    @UseGuards(AuthGuard)
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    @Put('blogs/:blogId/posts/:postId')
    async updatePost(@Req() req: Request, @Param('blogId') blogId: string, @Param('postId') postId: string, @Body() body: UpdatePostForBlogModel){
        const result = await this.commandBus.execute(new UpdateOwnPostCommand(blogId, postId, body, req.user!));
        if(result.code == ResultCode.Forbidden) throw new ForbiddenException();
        if(result.code == ResultCode.Success)  return; 
        throw new NotFoundException();
    }

    @UseGuards(AuthGuard)
    @Get(`blogs/:id/${RouterPaths.posts}`)
    async getPostsForBlog(@Req() req: Request, @Param('id') blogId: string, 
        @Query() query:Partial<PostQueryType>): Promise<PostsWithQueryOutputModel>{
        const foundBlog = await this.blogsQueryRepo.findBlogById(blogId);
        if(!foundBlog) throw new NotFoundException('Blog not found');
        if(foundBlog.ownerId != req.user.id) throw new ForbiddenException();
        return await this.postsQueryRepo.getPostsByBlogId(blogId,postQueryParams(query), req.userId!);
    } 

    @UseGuards(AuthGuard)
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    @Delete('blogs/:blogId/posts/:postId')
    async deletePost(@Req() req: Request, @Param('blogId') blogId: string, @Param('postId') postId: string,){
        const result = await this.commandBus.execute(new DeleteOwnPostCommand(blogId, postId, req.user!));
        if(result.code == ResultCode.Forbidden) throw new ForbiddenException();
        if(result.code == ResultCode.Success)  return; 
        throw new NotFoundException();
    }

    @UseGuards(AuthGuard)
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    @Put('users/:id/ban')
    async banUserForBlog(@Req() req: Request, @Param() params: UserBanParams, @Body() body: BanBlogForUserModel){
        const user = await this.usersQueryRepo.getUserById(params.id);
        if(!user) throw new NotFoundException();
        const blog = await this.blogsQueryRepo.findBlogById(body.blogId);
        if(blog && blog.ownerId != req.user.id) throw new ForbiddenException();
        const result = await this.blogsRepository.banUserForBlog(params.id, body);
        if(!result) throw new BadRequestException(); 
    }

    @UseGuards(AuthGuard)
    @Get('users/blog/:id')
    async getBannedUsersForBlog(@Req() req: Request, @Param() params: UserBanParams,
        @Query() query: Partial<BannedUsersQueryType>):Promise<BannedUsersInfoOutputModel>{
        const blog = await this.blogsQueryRepo.findBlogById(params.id);
        if(!blog) throw new NotFoundException();
        if(blog.ownerId != req.user.id) throw new ForbiddenException();
        return await this.usersQueryRepo.getBannedUsers(bannedUsersQueryParams(query), params.id);
    }

    @UseGuards(AuthGuard)
    @Get('blogs/comments')
    async getCommentsForAllBloggerPosts(@Req() req: Request,
        @Query() query: Partial<CommentQueryType>): Promise<CommentsWithQueryOutputModel>{
        return await this.commentsQueryRepo.getCommentsForAllBloggerPosts(commentQueryParams(query), req.user!.id);
        
    }

    @UseGuards(AuthGuard)
    @Post('blogs/:id/images/main')
    @UseInterceptors(FileInterceptor('file'))
    async uploadBlogImage(@UploadedFile() file, @Req() req: Request, @Param() params: UserBanParams){
        const result = await this.commandBus.execute(new UploadImageCommand(file, params.id));
        return result;
    }
}