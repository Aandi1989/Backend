// import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
// import { CreateBlogModel } from "../../api/models/input/create-session.input.model";
// import { BlogsRepository } from "../../repo/security.repository";


// export class UpdateBlogCommand {
//     constructor(public id: string,
//                 public data: Partial<CreateBlogModel>){}
// }

// @CommandHandler(UpdateBlogCommand)
// export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand>{
//     constructor(protected blogsRepository: BlogsRepository) { }
  
//     async execute(command: UpdateBlogCommand): Promise<boolean> {
//         return await this.blogsRepository.updateBlog(command.id, command.data)
//     }
//   }