import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, HttpCode, NotFoundException, Param, Post, Put, Query, Req, Res, UseGuards } from "@nestjs/common";
import { BlogQueryType, BlogType } from "../types/types";
import { blogQueryParams, postQueryParams } from "src/common/helpers/queryStringModifiers";
import { BlogsQueryRepo } from "../repo/blogs.query.repository";
import { BlogsService } from "../application/blogs.service";
import { PostQueryType, PostType } from "src/features/posts/types/types";
import { PostsService } from "src/features/posts/application/posts.service";
import { PostsQueryRepo } from "src/features/posts/repo/posts.query.repository";
import { RouterPaths, HTTP_STATUSES } from "src/common/utils/utils";
import { CreateBlogModel } from "./models/input/create-blog.input.model";
import { BlogsWithQueryOutputModel } from "./models/output/blog.output.model";
import { PostsWithQueryOutputModel } from "src/features/posts/api/models/output/post.output.model";
import { CommandBus } from "@nestjs/cqrs";
import { CreateBlogCommand } from "../application/use-case/create-blog.use-case";
import { DeleteBlogCommand } from "../application/use-case/delete-blog.use-case";
import { UpdateBlogCommand } from "../application/use-case/update-blog.use-case";
import { BasicAuthGuard } from "src/common/guards/basicAuth";
import { CreatePostForBlogCommand } from "src/features/posts/application/use-cases/create-post-for-blog.use-case";
import { CreatePostForBlogModel } from "./models/input/create-post-for-blog.model";
import { AccessUserId } from "src/common/guards/accessUserId";
import { Response, Request } from 'express';
import { CreatePostModel } from "src/features/posts/api/models/input/create-post.input.model";
import { DeletePostCommand } from "src/features/posts/application/use-cases/delete-post.use-case";
import { ResultCode } from "src/common/types/types";
import { UpdatePostCommand } from "src/features/posts/application/use-cases/update-post.use-case";
import { UpdatePostForBlogModel } from "./models/input/update-post.input";
import { CheckPostCommand } from "src/features/posts/application/use-cases/change-post.use-case";

@Controller(RouterPaths.blogsSA)
export class BlogsSAController {
    constructor(protected blogsQueryRepo: BlogsQueryRepo,
                protected blogsService: BlogsService,
                protected postsService: PostsService,
                protected postsQueryRepo: PostsQueryRepo,
                private commandBus: CommandBus){}
    @UseGuards(BasicAuthGuard)
    @Get()
    async getBlogs(@Query() query: Partial<BlogQueryType>): Promise<BlogsWithQueryOutputModel>{
        return await this.blogsQueryRepo.getBlogs(blogQueryParams(query));
    }
    @UseGuards(BasicAuthGuard)
    @Post()
    async createBlog (@Req() req: Request, @Body() body: CreateBlogModel): Promise<BlogType>{
        return await this.commandBus.execute(new CreateBlogCommand(body));
    }
    @UseGuards(BasicAuthGuard)
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    @Put(':id')
    async updateBlog(@Param('id') blogId: string, @Body() body: CreateBlogModel){
        const isUpdated = await this.commandBus.execute(new UpdateBlogCommand( blogId, body));
        if(isUpdated) return;  
        throw new NotFoundException('Blog not found');
    }
    @UseGuards(BasicAuthGuard)
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    @Delete(':id')
    async deleteBlog(@Param('id') blogId: string){
        const isDeleted = await this.commandBus.execute(new DeleteBlogCommand(blogId))
        if(isDeleted) return;
        throw new NotFoundException('Blog not found');
    }
    @UseGuards(BasicAuthGuard)
    @Post(`:id/${RouterPaths.posts}`)
    async createPostForBlog(@Param('id') blogId: string, @Body() body: CreatePostForBlogModel): Promise<PostType | null>{
        const foundBlog = await this.blogsQueryRepo.findBlogById(blogId);
        if(!foundBlog) throw new NotFoundException();
        return await this.commandBus.execute(new CreatePostForBlogCommand(body, blogId));
    }
    @UseGuards(AccessUserId)
    @Get(`:id/${RouterPaths.posts}`)
    async getPostsForBlog(@Req() req: Request, @Param('id') blogId: string, 
        @Query() query:Partial<PostQueryType>): Promise<PostsWithQueryOutputModel>{
        const foundBlog = await this.blogsQueryRepo.findBlogById(blogId);
        if(!foundBlog) throw new NotFoundException('Blog not found');
        return await this.postsQueryRepo.getPostsByBlogId(blogId,postQueryParams(query), req.userId!);
    } 
    
    @UseGuards(BasicAuthGuard)
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    @Put(':blogId/posts/:postId')
    async updatePost(@Param('blogId') blogId: string, @Param('postId') postId: string, @Body() body: UpdatePostForBlogModel){
        // @ts-ignore
        const result = await this.commandBus.execute(new CheckPostCommand(blogId, postId));
        if(result.code === ResultCode.NotFound) throw new NotFoundException();
       
        // if(result.code === ResultCode.Forbidden) throw new ForbiddenException();
        const isUpdated = await this.commandBus.execute(new UpdatePostCommand(postId, body));
        if(isUpdated) return true;
        throw new BadRequestException();
    }
    @UseGuards(BasicAuthGuard)
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    @Delete(':blogId/posts/:postId')
    async deletePost(@Param('blogId') blogId: string, @Param('postId') postId: string,){
         // @ts-ignore
        const result = await this.commandBus.execute(new CheckPostCommand(blogId, postId));
        if(result.code === ResultCode.NotFound) throw new NotFoundException();
       
        // if(result.code === ResultCode.Forbidden) throw new ForbiddenException();
        const isDeleted = await this.commandBus.execute(new DeletePostCommand(postId))
        if(isDeleted) return true;
        throw new BadRequestException();
    }
}