import { Response, Router } from "express";
import { PostQueryType, postQueryParams, CommentQueryType, commentQueryParams } from "../assets/queryStringModifiers";
import { CommentsService } from "../domain/comments-service";
import { PostsService } from "../domain/posts-service";
import { CreateCommentModel } from "../features/comments/models/CreateCommentModel";
import { CreatePostModel } from "../features/posts/models/CreatePostModel";
import { URIParamsPostIdModel } from "../features/posts/models/URIParamsPostIdModel";
import { CommentsQueryRepo } from "../repositories/commentsQueryRepository";
import { PostsQueryRepo } from "../repositories/postsQueryRepository";
import { RequestWithQuery, PostsWithQueryType, RequestWithBody, PostType, RequestWithParams, RequestWithParamsAndBody, RequestWithParamsAndBodyAndUserId, UserOutputType, RequestWithParamsAndQuery, ResultCode } from "../types/types";
import { HTTP_STATUSES } from "../utils";
import { JwtService } from "../application/jwt-service";
import { UpdateModelStatus } from "../features/comments/models/UpdateModelStatus";

export class PostsController {
    constructor(protected commentsService: CommentsService,
                protected postsService: PostsService,
                protected commentsQueryRepo: CommentsQueryRepo,
                protected postsQueryRepo: PostsQueryRepo,
                protected jwtService: JwtService){}
    async getPosts (req: RequestWithQuery<Partial<PostQueryType>>, res: Response<PostsWithQueryType>) {
        const response = await this.postsQueryRepo.getPosts(postQueryParams(req.query));
        return res.status(HTTP_STATUSES.OK_200).json(response);
    }
    async createPost (req: RequestWithBody<CreatePostModel>, res: Response<PostType>) {
        const createdBlog = await this.postsService.createPost(req.body);
        return res.status(HTTP_STATUSES.CREATED_201).json(createdBlog);
    }
    async getPost (req: RequestWithParams<URIParamsPostIdModel>,res: Response<PostType>) {
        const foundBlog = await this.postsQueryRepo.getPostById(req.params.id);
        if (!foundBlog) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return res.status(HTTP_STATUSES.OK_200).json(foundBlog)
    }
    async updatePost (req: RequestWithParamsAndBody<URIParamsPostIdModel, Partial<PostType>>, res: Response) {
            const isUpdated = await this.postsService.updatePost(req.params.id, req.body);
            if(isUpdated) return res.send(HTTP_STATUSES.NO_CONTENT_204);
            return res.send(HTTP_STATUSES.NOT_FOUND_404);
    }
    async deletePost (req: RequestWithParams<URIParamsPostIdModel>,res: Response) {
        const isDeleted = await this.postsService.deletePost(req.params.id)
        if(isDeleted) return res.send(HTTP_STATUSES.NO_CONTENT_204);
        return res.send(HTTP_STATUSES.NOT_FOUND_404); 
    }
    async createCommentForPost (req: RequestWithParamsAndBodyAndUserId<URIParamsPostIdModel,CreateCommentModel,UserOutputType>, 
        res:Response) {
        const post = await this.postsQueryRepo.getPostById(req.params.id)
        if(!post) return res.send(HTTP_STATUSES.NOT_FOUND_404);
        const createdComment = await this.commentsService.createComment(req.params.id, req.body.content, req.user!);
        return res.status(HTTP_STATUSES.CREATED_201).json(createdComment);
    }
    async getCommentsForPost (req: RequestWithParamsAndQuery<URIParamsPostIdModel,Partial<CommentQueryType>>, 
        res: Response){
        let accessTokenData;
        if(req.headers.authorization){
        const accessToken = req.headers.authorization.split(' ')[1];
        accessTokenData = await this.jwtService.getUserIdByToken(accessToken)}   
        const post = await this.postsQueryRepo.getPostById(req.params.id)
        if(!post) return res.send(HTTP_STATUSES.NOT_FOUND_404);
        const comments = await this.commentsQueryRepo.getCommentsByPostId(req.params.id, 
            commentQueryParams(req.query), accessTokenData?.userId)  
         return res.status(HTTP_STATUSES.OK_200).json(comments)
    }
    async likePost (req: RequestWithParamsAndBodyAndUserId<URIParamsPostIdModel,UpdateModelStatus,UserOutputType>, res: Response) {
        const result = await this.postsService.likePost(req.params.id, req.body.likeStatus, req.user!.id);
        if(result.code === ResultCode.NotFound) return res.send(HTTP_STATUSES.NOT_FOUND_404);
        if(result.code === ResultCode.Success) return res.send(HTTP_STATUSES.NO_CONTENT_204);
    }
}