import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Post, Put, Query, Req, Res, UseGuards } from "@nestjs/common";
import { myStatus, PostQueryType, PostType } from "../types/types";
import { Response, Request } from 'express';
import { commentQueryParams, postQueryParams } from "src/common/helpers/queryStringModifiers";
import { PostsQueryRepo } from "../repo/posts.query.repository";
import { PostsService } from "../application/posts.service";
import { CommentsQueryRepo } from "../../comments/repo/comments.query.repository";
import { CommentQueryType } from "../../comments/types/types";
import { RouterPaths, HTTP_STATUSES } from "src/common/utils/utils";
import { CreatePostModel } from "./models/input/create-post.input.model";
import { PostsWithQueryOutputModel } from "./models/output/post.output.model";
import { CommentOutputModel, CommentsWithQueryOutputModel } from "src/features/comments/api/models/output/comment.output.model";
import { CommandBus } from "@nestjs/cqrs";
import { CreatePostCommand } from "../application/use-cases/create-post.use-case";
import { DeletePostCommand } from "../application/use-cases/delete-post.use-case";
import { UpdatePostCommand } from "../application/use-cases/update-post.use-case";
import { AuthGuard } from "src/common/guards/auth.guard";
import { CreateCommentModel } from "src/features/comments/api/models/input/create-comment.input.model";
import { CreateCommentCommand } from "src/features/comments/application/use-case/create-comment.use-case";
import { SetStatusModel } from "../../likes/api/models/input/set-status.input.model";
import { LikePostCommand } from "../../likes/application/use-cases/like-post.use-case";
import { ResultCode } from "src/common/types/types";
import { BasicAuthGuard } from "src/common/guards/basicAuth";
import { AccessUserId } from "src/common/guards/accessUserId";


@Controller(RouterPaths.posts)
export class PostsController{
    constructor(protected postsQueryRepo: PostsQueryRepo,
                protected postsService: PostsService,
                protected commentsQueryRepo: CommentsQueryRepo,
                private commandBus: CommandBus){}
    @UseGuards(AccessUserId)
    @Get()
    async getPosts(@Req() req: Request, @Query() query: Partial<PostQueryType>): Promise<PostsWithQueryOutputModel>{
        return await this.postsQueryRepo.getPosts(postQueryParams(query), req.userId!);
    }
    @UseGuards(BasicAuthGuard)
    @Post()
    // must be <PostType>
    async createPost(@Body() body: CreatePostModel): Promise<PostType> {
        return await this.commandBus.execute(new CreatePostCommand(body));
    }
    @UseGuards(AccessUserId)
    @Get(':id')
    async getPost(@Req() req: Request, @Param('id') postId: string): Promise<PostType | null> {
        const foundPost = await this.postsQueryRepo.getPostById(postId, req.userId!);
        if (!foundPost) throw new NotFoundException('Post not found');
        return foundPost;
    }
    @UseGuards(BasicAuthGuard)
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    @Put(':id')
    async updatePost(@Param('id') postId: string, @Body() body: CreatePostModel){
        const isUpdated = await this.commandBus.execute(new UpdatePostCommand(postId, body));
        if(isUpdated) return true;
        throw new NotFoundException('Post not found'); 
    }
    @UseGuards(BasicAuthGuard)
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    @Delete(':id')
    async deletePost(@Param('id') postId: string){
        const isDeleted = await this.commandBus.execute(new DeletePostCommand(postId))
        if(isDeleted) return;
        throw new NotFoundException('Post not found');
    }
    @UseGuards(AccessUserId)
    @Get(`:id/${RouterPaths.comments}`)
    async getCommentsForPost(@Req() req: Request, @Param('id') postId: string, 
        @Query() query: Partial<CommentQueryType>): Promise<CommentsWithQueryOutputModel>{
        const post = await this.postsQueryRepo.getPostById(postId, req.userId!)
        if(!post) throw new NotFoundException('Post not found');
        return await this.commentsQueryRepo.getCommentsByPostId(postId ,commentQueryParams(query), req.userId!);
    }
    @UseGuards(AuthGuard)
    @Post(':id/comments')
    async createComment (@Req() req: Request, @Param('id') postId: string, 
        @Body() body: CreateCommentModel): Promise<CommentOutputModel>{
        const post = await this.postsQueryRepo.getPostById(postId);
        if(!post) throw new NotFoundException();
        return await this.commandBus.execute(new CreateCommentCommand(postId, body.content, req.user!))
    }
    @UseGuards(AuthGuard)
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    @Put(':id/like-status')
    async likePost(@Req() req: Request, @Param('id') postId: string, @Body() body: SetStatusModel){
        const result = await this.commandBus.execute(new LikePostCommand(postId, body.likeStatus, req.user.id));
        if(result.code === ResultCode.NotFound) throw new NotFoundException();
        return;
    }

}