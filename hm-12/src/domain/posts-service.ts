import { URIParamsBlogIdModel } from "../features/blogs/models/URIParamsBlogIdModel";
import { Like } from "../features/comments/entities/like";
import { CreatePostModel } from "../features/posts/models/CreatePostModel";
import { CommentsRepository } from "../repositories/comments-db-repository";
import { LikesRepository } from "../repositories/likes-db-repository";
import { PostsRepository} from "../repositories/posts-db-repository";
import { PostsQueryRepo } from "../repositories/postsQueryRepository";
import { PostType, Result, ResultCode, UserOutputType, myStatus } from "../types/types";


export class PostsService {
    constructor(protected commentsRepository: CommentsRepository,
                protected postsRepository: PostsRepository,
                protected postsQueryRepo: PostsQueryRepo,
                protected likesRepository: LikesRepository){}
    async createPost(data: CreatePostModel, params?:URIParamsBlogIdModel): Promise<PostType>{
        const newPost = {
            id: (+new Date()).toString(),
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: params?.blogId ? params.blogId : data.blogId,
            blogName: data.blogName ? data.blogName : '',
            createdAt: new Date().toISOString()
        };
        const createPost = await this.postsRepository.createPost(newPost)
        return createPost;
    }
    async updatePost(id: string, data: Partial<PostType>): Promise<boolean>{
        return await this.postsRepository.updatePost(id, data);
    }
    async deletePost(id: string):Promise<boolean> {
        return await this.postsRepository.deletePost(id)
    }
    async likePost(postId: string, myStatus: myStatus, userId: string): Promise<Result>{
        const foundPost = await this.postsQueryRepo.getPostById(postId);
        if(!foundPost) return { code: ResultCode.NotFound };
        const newStatus = new Like(userId, postId, myStatus);

        const addedLike = await this.likesRepository.addLike(newStatus)

        return {code: ResultCode.Success}
    }
} 
