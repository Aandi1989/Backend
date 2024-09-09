import { Controller, Delete, Res } from "@nestjs/common";
import { Response } from 'express';
import { UsersRepository } from "../users/repo/users.repository";
import { BlogsRepository } from "../blogs/repo/blogs.repository";
import { CommentsRepository } from "../comments/repo/comments.repository";
import { LikesRepository } from "../likes/repo/like.repository";
import { SecurityRepository } from "../security/repo/security.repository";
import { PostsRepository } from "../posts/repo/posts.repository";
import { RouterPaths, HTTP_STATUSES } from "../../common/utils/utils";
import { GamesRepository } from "../game/repo/games.repository";
import { QuestionsRepository } from "../question/repo/questions.repository";

@Controller(RouterPaths.testingAllData)
export class DeleteAllDataController {
    constructor(protected usersRepository: UsersRepository,
                protected blogsRepository: BlogsRepository,
                protected postsRepository: PostsRepository,
                protected commentsRepository: CommentsRepository,
                protected likesRepository: LikesRepository,
                protected securityRepository: SecurityRepository,
                protected questionsRepository: QuestionsRepository,
                protected gamesRepository: GamesRepository){}

    @Delete()
    async deleteAllData(@Res() res: Response){
        await this.gamesRepository.deleteAllData();
        await this.questionsRepository.deleteAllData();
        await this.securityRepository.deleteAllData();
        await this.likesRepository.deleteAllData();
        await this.commentsRepository.deleteAllData();
        await this.postsRepository.deleteAllData();
        await this.blogsRepository.deleteAllData();
        await this.usersRepository.deleteAllData();
        return res.send(HTTP_STATUSES.NO_CONTENT_204);
    }
}