import { Controller, Delete, Res } from "@nestjs/common";
import { PostsRepository } from "src/features/posts/repo/posts.repository";
import { Response } from 'express';
import { UsersRepository } from "../users/repo/users.repository";
import { BlogsRepository } from "../blogs/repo/blogs.repository";
import { CommentsRepository } from "../comments/repo/comments.repository";
import { RouterPaths, HTTP_STATUSES } from "src/common/utils/utils";
import { LikesRepository } from "../likes/repo/like.repository";

@Controller(RouterPaths.testingAllData)
export class DeleteAllDataController {
    constructor(protected usersRepository: UsersRepository,
                protected blogsRepository: BlogsRepository,
                protected postsRepository: PostsRepository,
                protected commentsRepository: CommentsRepository,
                protected likesRepository: LikesRepository){}

    @Delete()
    async deleteAllData(@Res() res: Response){
        await this.usersRepository.deleteAllData();
        await this.blogsRepository.deleteAllData();
        await this.postsRepository.deleteAllData();
        await this.commentsRepository.deleteAllData();
        await this.likesRepository.deleteAllData();
        return res.send(HTTP_STATUSES.NO_CONTENT_204);
    }
}