import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UserOutputModel } from "../../../users/api/models/output/user.output.model";
import { Result, ResultCode } from "../../../../common/types/types";
import { UsersQueryRepo } from "../../../users/repo/users.query.repository";
import { BlogsQueryRepo } from "../../repo/blogs.query.repository";
import { BlogQueryOutputType, BlogType } from "../../types/types";
import { BlogsWithQueryOutputModel } from "../../api/models/output/blog.output.model";
import { blogQueryParams } from "../../../../common/helpers/queryStringModifiers";
import { loginsDictionary } from "../../../game/types/types";

export class GetSaBlogsCommand {
    constructor(public query: BlogQueryOutputType) { }
}

@CommandHandler(GetSaBlogsCommand)
export class GetSaBlogsUseCase implements ICommandHandler<GetSaBlogsCommand> {
    constructor(protected blogsQueryRepo: BlogsQueryRepo,
                protected usersQueryRepo: UsersQueryRepo) { }

    async execute(command: GetSaBlogsCommand){
        const usersIds = new Set();
        let logins: loginsDictionary = {};

        const blogsWithPagination: BlogsWithQueryOutputModel = await this.blogsQueryRepo.getBlogs(command.query);

        blogsWithPagination.items.forEach(blog => {
            usersIds.add(blog.ownerId);
        })

         // get users' logins
         const loginsArr = await this.usersQueryRepo.getLoginsByIdArr(Array.from(usersIds) as string[]);

         logins = loginsArr.reduce((obj, user) => {
            obj[user.id] = user.login;
            return obj;
        }, {});

        const blogsWithBloggerInfo: BlogType[] = blogsWithPagination.items.map((blog: BlogType) => {
            return{
                id: blog.id,
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
                createdAt: blog.createdAt,
                isMembership: blog.isMembership,
                blogOwnerInfo: blog.ownerId ? 
                { 
                    userId: blog.ownerId, 
                    userLogin: logins[blog.ownerId]
                } : { 
                    userId: null,
                    userLogin: null
                }
            }
        })
        blogsWithPagination.items = blogsWithBloggerInfo;
        return blogsWithPagination;
    }
}