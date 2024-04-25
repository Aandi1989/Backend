import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LikePostUseCase } from "./application/use-cases/like-post.use-case";
import { LikesPosts, LikesComments } from "./domain/likes.entity";
import { LikesQueryRepo } from "./repo/like.query.repository";
import { LikesRepository } from "./repo/like.repository";
import { PostsModule } from "../posts/post.module";
import { LikeCommentUseCase } from "./application/use-cases/like-comment.use-case";
import { CommentsModule } from "../comments/comment.module";


@Module({
    imports:[TypeOrmModule.forFeature([LikesPosts, LikesComments]), forwardRef(() => PostsModule), CommentsModule],
    providers:[LikesQueryRepo, LikesRepository, LikePostUseCase, LikeCommentUseCase],
    exports: [ TypeOrmModule.forFeature([LikesPosts]), LikesRepository ]
})
export class LikesModule {}