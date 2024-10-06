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
import { Request } from 'express';
import { UpdatePostForBlogModel } from "./models/input/update-post.input";
import { AccessUserId } from "../../../common/guards/accessUserId";
import { BasicAuthGuard } from "../../../common/guards/basicAuth";
import { blogQueryParams, postQueryParams } from "../../../common/helpers/queryStringModifiers";
import { ResultCode } from "../../../common/types/types";
import { RouterPaths, HTTP_STATUSES } from "../../../common/utils/utils";
import { PostsWithQueryOutputModel } from "../../posts/api/models/output/post.output.model";
import { CreatePostForBlogCommand } from "../../posts/application/use-cases/create-post-for-blog.use-case";
import { DeletePostCommand } from "../../posts/application/use-cases/delete-post.use-case";
import { UpdatePostCommand } from "../../posts/application/use-cases/update-post.use-case";
import { PostsQueryRepo } from "../../posts/repo/posts.query.repository";
import { PostType, PostQueryType } from "../../posts/types/types";
import { BindBlogParams } from "./models/input/bind-blog.params.model";
import { BlogsRepository } from "../repo/blogs.repository";
import { GetSaBlogsCommand } from "../application/use-case/get-SAblogs.use-case";
import { UserBanParams } from "../../users/api/models/input/user-id.dto";
import { BanBlogModel } from "./models/input/ban-blog.input";

@Controller(RouterPaths.blogsSA)
export class BlogsSAController {
    constructor(protected blogsQueryRepo: BlogsQueryRepo,
                protected postsQueryRepo: PostsQueryRepo,
                protected blogsRepository: BlogsRepository,
                private commandBus: CommandBus){}
    @UseGuards(BasicAuthGuard)
    @Get()
    async getBlogs(@Query() query: Partial<BlogQueryType>): Promise<BlogsWithQueryOutputModel>{
        const queryModified = blogQueryParams(query);
        return await this.commandBus.execute(new GetSaBlogsCommand(queryModified));
    }

    @UseGuards(BasicAuthGuard)
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    @Put(':id/bind-with-user/:userId')
    async bindBlog(@Param() params: BindBlogParams){
        const result = await this.blogsRepository.bindBlog(params.id, params.userId);
        if(result) return;
        throw new BadRequestException();
    }
    
    @UseGuards(BasicAuthGuard)
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    @Put(':id/ban')
    async banBlog(@Param() params: UserBanParams, @Body() body: BanBlogModel){
        const result = await this.blogsRepository.banBlog(params.id, body);
        if(result) return;
        throw new NotFoundException();
    }
}