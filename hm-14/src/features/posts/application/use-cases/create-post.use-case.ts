import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreatePostModel } from "../../api/models/input/create-post.input.model";
import { PostsRepository } from "../../repo/posts.repository";
import { myStatus, PostType } from "../../types/types";

export class CreatePostCommand {
    constructor(public data: CreatePostModel,
                public blogId?: string){}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand>{
    constructor(protected postsRepository: PostsRepository) { }
  
    async execute(command: CreatePostCommand): Promise<PostType> {
            const newPost = {
                id: (+new Date()).toString(),
                title: command.data.title,
                shortDescription: command.data.shortDescription,
                content: command.data.content,
                blogId: command.blogId ? command.blogId : command.data.blogId,
                blogName: command.data.blogName ? command.data.blogName : '',
                createdAt: new Date().toISOString(),
                extendedLikesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: myStatus.None,
                    newestLikes: []
                }
            }
            const createPost = await this.postsRepository.createPost(newPost)
            return createPost;
    }
  }