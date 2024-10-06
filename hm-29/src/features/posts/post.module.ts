import { forwardRef, Module } from "@nestjs/common";
import { CqrsModule } from '@nestjs/cqrs';
import { PostsQueryRepo } from "./repo/posts.query.repository";
import { LikesModule } from "../likes/like.module";
import { PostsRepository } from "./repo/posts.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CreatePostForBlogUseCase } from "./application/use-cases/create-post-for-blog.use-case";
import { DeletePostUseCase } from "./application/use-cases/delete-post.use-case";
import { UpdatePostUseCase } from "./application/use-cases/update-post.use-case";
import { PostsController } from "./api/posts.controller";
import { JwtService } from "../../common/services/jwt-service";
import { CommentsModule } from "../comments/comment.module";
import { UsersModule } from "../users/user.module";
import { BlogsModule } from "../blogs/blog.module";

@Module({
    imports:[ TypeOrmModule.forFeature(), forwardRef(() => LikesModule), UsersModule, 
        CommentsModule, forwardRef(() => BlogsModule), CqrsModule],
    providers:[PostsQueryRepo, PostsRepository, CreatePostForBlogUseCase, 
        DeletePostUseCase, UpdatePostUseCase, JwtService
     ],
    controllers:[PostsController],
    exports: [PostsQueryRepo, PostsRepository]
})
export class PostsModule {}