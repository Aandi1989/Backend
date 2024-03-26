import { Controller, Delete, Res } from "@nestjs/common";
import { BlogsRepository } from "src/blogs/repo/blogs.repository";
import { CommentsRepository } from "src/comments/repo/comments.repository";
import { PostsRepository } from "src/posts/repo/posts.repository";
import { UsersRepository } from "src/users/repo/users.repository";
import { HTTP_STATUSES, RouterPaths } from "src/utils";
import { Response } from 'express';

@Controller(RouterPaths.allData)
export class DeleteAllDataController {
    constructor(protected usersRepository: UsersRepository,
                protected blogsRepository: BlogsRepository,
                protected postsRepository: PostsRepository,
                protected commentsRepository: CommentsRepository){}

    @Delete()
    async deleteAllData(@Res() res: Response){
        await this.usersRepository.deleteAllData();
        await this.blogsRepository.deleteAllData();
        await this.postsRepository.deleteAllData();
        await this.commentsRepository.deleteAllData();
        return res.send(HTTP_STATUSES.NO_CONTENT_204);
    }
}