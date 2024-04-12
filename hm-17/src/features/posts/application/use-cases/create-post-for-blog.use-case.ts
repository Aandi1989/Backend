import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PostsRepository } from "../../repo/posts.repository";
import { myStatus, PostType } from "../../types/types";
import { CreatePostForBlogModel } from "src/features/blogs/api/models/input/create-post-for-blog.model";
import {v4 as uuidv4} from 'uuid';


export class CreatePostForBlogCommand {
    constructor(public data: CreatePostForBlogModel,
                public blogId: string){}
}

@CommandHandler(CreatePostForBlogCommand)
export class CreatePostForBlogUseCase implements ICommandHandler<CreatePostForBlogCommand>{
    constructor(protected postsRepository: PostsRepository) { }
  
    async execute(command: CreatePostForBlogCommand): Promise<PostType> {
            const newPost = {
                id: uuidv4(),
                title: command.data.title,
                shortDescription: command.data.shortDescription,
                content: command.data.content,
                blogId: command.blogId,
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