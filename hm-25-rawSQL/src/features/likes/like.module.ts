import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LikePostUseCase } from "./application/use-cases/like-post.use-case";
import { LikesQueryRepo } from "./repo/like.query.repository";
import { LikesRepository } from "./repo/like.repository";
import { CommentsModule } from "../comments/comment.module";
import { PostsModule } from "../posts/post.module";
import { LikeCommentUseCase } from "../comments/application/use-case/like-comment.use-case";


@Module({
    imports:[TypeOrmModule.forFeature(), forwardRef(() => PostsModule), CommentsModule],
    providers:[LikesQueryRepo, LikesRepository, LikePostUseCase, LikeCommentUseCase],
    exports: [ TypeOrmModule.forFeature(), LikesRepository ]
})
export class LikesModule {}