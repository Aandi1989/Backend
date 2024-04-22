import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdatePostForBlogModel } from "src/features/blogs/api/models/input/update-post.input";
import { PostsRepository } from "../../repo/posts.repository";

export class UpdatePostCommand {
    constructor(public id: string,
                public data: UpdatePostForBlogModel){}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand>{
    constructor(protected postsRepository: PostsRepository) { }
  
    async execute(command: UpdatePostCommand): Promise<boolean> {
        return await this.postsRepository.updatePost(command.id, command.data);
    }
  }