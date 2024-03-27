import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res } from "@nestjs/common";
import { HTTP_STATUSES, RouterPaths } from "src/utils";
import { CreatePostModel, PostQueryType, PostType } from "./types/types";
import { Response } from 'express';
import { commentQueryParams, postQueryParams } from "src/helpers/queryStringModifiers";
import { PostsQueryRepo } from "./repo/posts.query.repository";
import { PostsService } from "./service/posts.service";
import { CommentQueryType } from "src/comments/types/types";
import { CommentsQueryRepo } from "src/comments/repo/comments.query.repository";

@Controller(RouterPaths.posts)
export class PostsController{
    constructor(protected postsQueryRepo: PostsQueryRepo,
                protected postsService: PostsService,
                protected commentsQueryRepo: CommentsQueryRepo){}
    @Get()
    async getPosts(@Query() query: Partial<PostQueryType>, @Res() res: Response){
        const response = await this.postsQueryRepo.getPosts(postQueryParams(query));
        return res.status(HTTP_STATUSES.OK_200).send(response);
    }
    @Post()
    async createPost(@Body() body: CreatePostModel,  @Res() res: Response){
        const createdPost = await this.postsService.createPost(body);
        return res.status(HTTP_STATUSES.CREATED_201).json(createdPost);
    }
    @Get(':id')
    async getPost(@Param('id') postId: string,  @Res() res: Response) {
        const foundBlog = await this.postsQueryRepo.getPostById(postId);
        if (!foundBlog) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return res.status(HTTP_STATUSES.OK_200).send(foundBlog)
    }
    @Put(':id')
    async updatePost(@Param('id') postId: string, @Body() body: Partial<PostType>, @Res() res: Response ){
        const isUpdated = await this.postsService.updatePost(postId, body);
        if(isUpdated) return res.send(HTTP_STATUSES.NO_CONTENT_204);
        return res.send(HTTP_STATUSES.NOT_FOUND_404); 
    }
    @Delete(':id')
    async deletePost(@Param('id') postId: string, @Res() res: Response ){
        const isDeleted = await this.postsService.deletePost(postId)
        if(isDeleted) return res.send(HTTP_STATUSES.NO_CONTENT_204);
        return res.send(HTTP_STATUSES.NOT_FOUND_404);
    }
    @Get(`:id/${RouterPaths.comments}`)
    async getCommentsForPost(@Param('id') postId: string, @Query() query: Partial<CommentQueryType>, @Res() res: Response){
        const post = await this.postsQueryRepo.getPostById(postId)
        if(!post) return res.send(HTTP_STATUSES.NOT_FOUND_404);
        const comments = await this.commentsQueryRepo.getCommentsByPostId(postId ,commentQueryParams(query))  
        return res.status(HTTP_STATUSES.OK_200).send(comments)
    }
}