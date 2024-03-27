import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res } from "@nestjs/common";
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
    async getPosts(@Query() query: Partial<PostQueryType>, @Res() res): Promise<PostsWithQueryOutputModel>{
        const response = await this.postsQueryRepo.getPosts(postQueryParams(query));
        return res.status(HTTP_STATUSES.OK_200).send(response);
    }
    @Post()
    async createPost(@Body() body: CreatePostModel,  @Res() res): Promise<PostType> {
        const createdPost = await this.postsService.createPost(body);
        return res.status(HTTP_STATUSES.CREATED_201).json(createdPost);
    }
    @Get(':id')
    async getPost(@Param('id') postId: string,  @Res() res): Promise<PostType | null> {
        const foundBlog = await this.postsQueryRepo.getPostById(postId);
        if (!foundBlog) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return res.status(HTTP_STATUSES.OK_200).send(foundBlog)
    }
    @Put(':id')
    async updatePost(@Param('id') postId: string, @Body() body: Partial<CreatePostModel>, @Res() res: Response ){
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
    async getCommentsForPost(@Param('id') postId: string, @Query() query: Partial<CommentQueryType>,
         @Res() res): Promise<CommentsWithQueryOutputModel>{
        const post = await this.postsQueryRepo.getPostById(postId)
        if(!post) return res.send(HTTP_STATUSES.NOT_FOUND_404);
        const comments = await this.commentsQueryRepo.getCommentsByPostId(postId ,commentQueryParams(query))  
        return res.status(HTTP_STATUSES.OK_200).send(comments)
    }
}