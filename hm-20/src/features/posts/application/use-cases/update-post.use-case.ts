import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PostsRepository } from "../../repo/posts.repository";
import { UpdatePostForBlogModel } from "../../../blogs/api/models/input/update-post.input";

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