import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Post, Put, Query, Res } from "@nestjs/common";
import { PostQueryType, PostType } from "../types/types";
import { Response } from 'express';
import { commentQueryParams, postQueryParams } from "src/common/helpers/queryStringModifiers";
import { PostsQueryRepo } from "../repo/posts.query.repository";
import { PostsService } from "../application/posts.service";
import { CommentsQueryRepo } from "../../comments/repo/comments.query.repository";
import { CommentQueryType } from "../../comments/types/types";
import { RouterPaths, HTTP_STATUSES } from "src/common/utils/utils";
import { CreatePostModel } from "./models/input/create-post.input.model";
import { PostsWithQueryOutputModel } from "./models/output/post.output.model";
import { CommentsWithQueryOutputModel } from "src/features/comments/api/models/output/comment.output.model";


@Controller(RouterPaths.posts)
export class PostsController{
    constructor(protected postsQueryRepo: PostsQueryRepo,
                protected postsService: PostsService,
                protected commentsQueryRepo: CommentsQueryRepo){}
    @Get()
    async getPosts(@Query() query: Partial<PostQueryType>): Promise<PostsWithQueryOutputModel>{
        return await this.postsQueryRepo.getPosts(postQueryParams(query));
    }
    @Post()
    async createPost(@Body() body: CreatePostModel): Promise<PostType> {
        return await this.postsService.createPost(body);
    }
    @Get(':id')
    async getPost(@Param('id') postId: string): Promise<PostType | null> {
        const foundPost = await this.postsQueryRepo.getPostById(postId);
        if (!foundPost) throw new NotFoundException('Post not found');
        return foundPost;
    }
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    @Put(':id')
    async updatePost(@Param('id') postId: string, @Body() body: Partial<CreatePostModel>){
        const isUpdated = await this.postsService.updatePost(postId, body);
        if(isUpdated) return true;
        throw new NotFoundException('Post not found'); 
    }
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    @Delete(':id')
    async deletePost(@Param('id') postId: string){
        const isDeleted = await this.postsService.deletePost(postId)
        if(isDeleted) return;
        throw new NotFoundException('Post not found');
    }
    @Get(`:id/${RouterPaths.comments}`)
    async getCommentsForPost(@Param('id') postId: string, 
        @Query() query: Partial<CommentQueryType>): Promise<CommentsWithQueryOutputModel>{
        const post = await this.postsQueryRepo.getPostById(postId)
        if(!post) throw new NotFoundException('Post not found');
        return await this.commentsQueryRepo.getCommentsByPostId(postId ,commentQueryParams(query));
    }
}