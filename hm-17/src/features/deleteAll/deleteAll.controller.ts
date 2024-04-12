import { Controller, Delete, Res } from "@nestjs/common";
import { PostsRepository } from "src/features/posts/repo/posts.repository";
import { Response } from 'express';
import { UsersRepository } from "../users/repo/users.repository";
import { BlogsRepository } from "../blogs/repo/blogs.repository";
import { CommentsRepository } from "../comments/repo/comments.repository";
import { RouterPaths, HTTP_STATUSES } from "src/common/utils/utils";
import { LikesRepository } from "../likes/repo/like.repository";
import { SecurityRepository } from "../security/repo/security.repository";

@Controller(RouterPaths.testingAllData)
export class DeleteAllDataController {
    constructor(protected usersRepository: UsersRepository,
                protected blogsRepository: BlogsRepository,
                protected postsRepository: PostsRepository,
                protected commentsRepository: CommentsRepository,
                protected likesRepository: LikesRepository,
                protected securityRepository: SecurityRepository){}

    @Delete()
    async deleteAllData(@Res() res: Response){
        await this.securityRepository.deleteAllData();
        await this.postsRepository.deleteAllData();
        await this.blogsRepository.deleteAllData();
        await this.commentsRepository.deleteAllData();
        await this.likesRepository.deleteAllData();
        await this.usersRepository.deleteAllData();
        return res.send(HTTP_STATUSES.NO_CONTENT_204);
    }
}