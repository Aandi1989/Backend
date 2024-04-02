import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreatePostModel } from "../../api/models/input/create-post.input.model";
import { PostsRepository } from "../../repo/posts.repository";
import { myStatus, PostType } from "../../types/types";

export class UpdatePostCommand {
    constructor(public id: string,
                public data: CreatePostModel){}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand>{
    constructor(protected postsRepository: PostsRepository) { }
  
    async execute(command: UpdatePostCommand): Promise<boolean> {
        return await this.postsRepository.updatePost(command.id, command.data);
    }
  }