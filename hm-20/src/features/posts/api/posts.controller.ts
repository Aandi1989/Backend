import { Body, Controller, Get, HttpCode, NotFoundException, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { Request } from 'express';
import { AccessUserId } from "src/common/guards/accessUserId";
import { AuthGuard } from "src/common/guards/auth.guard";
import { commentQueryParams, postQueryParams } from "src/common/helpers/queryStringModifiers";
import { ResultCode } from "src/common/types/types";
import { HTTP_STATUSES, RouterPaths } from "src/common/utils/utils";
import { CreateCommentModel } from "src/features/comments/api/models/input/create-comment.input.model";
import { CommentOutputModel, CommentsWithQueryOutputModel } from "src/features/comments/api/models/output/comment.output.model";
import { CreateCommentCommand } from "src/features/comments/application/use-case/create-comment.use-case";
import { CommentsQueryRepo } from "../../comments/repo/comments.query.repository";
import { CommentQueryType } from "../../comments/types/types";
import { SetStatusModel } from "../../likes/api/models/input/set-status.input.model";
import { LikePostCommand } from "../../likes/application/use-cases/like-post.use-case";
import { PostsService } from "../application/posts.service";
import { PostsQueryRepo } from "../repo/posts.query.repository";
import { PostQueryType, PostType } from "../types/types";
import { PostsWithQueryOutputModel } from "./models/output/post.output.model";


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
    @UseGuards(AccessUserId)
    @Get(':id')
    async getPost(@Req() req: Request, @Param('id') postId: string): Promise<PostType | null> {
        const foundPost = await this.postsQueryRepo.getPostById(postId, req.userId!);
        if (!foundPost) throw new NotFoundException('Post not found');
        return foundPost;
    }
    @UseGuards(AccessUserId)
    @Get(`:id/${RouterPaths.comments}`)
    async getCommentsForPost(@Req() req: Request, @Param('id') postId: string, 
        @Query() query: Partial<CommentQueryType>): Promise<CommentsWithQueryOutputModel>{
        const post = await this.postsQueryRepo.getPostWithoutLikesById(postId)
        if(!post) throw new NotFoundException('Post not found');
        return await this.commentsQueryRepo.getCommentsByPostId(postId ,commentQueryParams(query), req.userId!);
    }
    @UseGuards(AuthGuard)
    @Post(':id/comments')
    async createComment (@Req() req: Request, @Param('id') postId: string, 
        @Body() body: CreateCommentModel): Promise<CommentOutputModel>{
        const post = await this.postsQueryRepo.getPostWithoutLikesById(postId);
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