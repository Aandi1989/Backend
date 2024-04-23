import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, HttpCode, NotFoundException, Param, Post, Put, Query, Req, Res, UseGuards } from "@nestjs/common";
import { BlogQueryType, BlogType } from "../types/types";
import { BlogsQueryRepo } from "../repo/blogs.query.repository";
import { BlogsService } from "../application/blogs.service";
import { CreateBlogModel } from "./models/input/create-blog.input.model";
import { BlogsWithQueryOutputModel } from "./models/output/blog.output.model";
import { CommandBus } from "@nestjs/cqrs";
import { CreateBlogCommand } from "../application/use-case/create-blog.use-case";
import { DeleteBlogCommand } from "../application/use-case/delete-blog.use-case";
import { UpdateBlogCommand } from "../application/use-case/update-blog.use-case";
import { CreatePostForBlogModel } from "./models/input/create-post-for-blog.model";
import { Response, Request } from 'express';
import { UpdatePostForBlogModel } from "./models/input/update-post.input";
import { AccessUserId } from "../../../common/guards/accessUserId";
import { BasicAuthGuard } from "../../../common/guards/basicAuth";
import { blogQueryParams, postQueryParams } from "../../../common/helpers/queryStringModifiers";
import { ResultCode } from "../../../common/types/types";
import { RouterPaths, HTTP_STATUSES } from "../../../common/utils/utils";
import { PostsWithQueryOutputModel } from "../../posts/api/models/output/post.output.model";
import { PostsService } from "../../posts/application/posts.service";
import { CreatePostForBlogCommand } from "../../posts/application/use-cases/create-post-for-blog.use-case";
import { DeletePostCommand } from "../../posts/application/use-cases/delete-post.use-case";
import { UpdatePostCommand } from "../../posts/application/use-cases/update-post.use-case";
import { PostsQueryRepo } from "../../posts/repo/posts.query.repository";
import { PostType, PostQueryType } from "../../posts/types/types";


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