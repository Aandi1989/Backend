import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreatePostModel } from "../../api/models/input/create-post.input.model";
import { PostsRepository } from "../../repo/posts.repository";
import { myStatus, PostSQL } from "../../types/types";
import {v4 as uuidv4} from 'uuid';

export class CreatePostCommand {
    constructor(public data: CreatePostModel){}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand>{
    constructor(protected postsRepository: PostsRepository) { }
  
    async execute(command: CreatePostCommand): Promise<PostSQL> {
            const newPost = {
                id: uuidv4(),
                title: command.data.title,
                shortDescription: command.data.shortDescription,
                content: command.data.content,
                blogId: command.data.blogId,
                blogName: command.data.blogName ? command.data.blogName : '',
                createdAt: new Date().toISOString()
            }
            const createPost = await this.postsRepository.createPost(newPost)
            return createPost;
    }
  }