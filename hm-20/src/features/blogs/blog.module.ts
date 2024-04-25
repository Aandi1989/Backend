import { Module } from "@nestjs/common";
import { CqrsModule } from '@nestjs/cqrs';
import { BlogsController } from "./api/blogs.controller";
import { BlogsSAController } from "./api/blogs.sa.controller";
import { BlogsQueryRepo } from "./repo/blogs.query.repository";
import { BlogsRepository } from "./repo/blogs.repository";
import { CreateblogUseCase } from "./application/use-case/create-blog.use-case";
import { DeleteBlogUseCase } from "./application/use-case/delete-blog.use-case";
import { UpdateBlogUseCase } from "./application/use-case/update-blog.use-case";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Blog } from "./domain/blog.entity";
import { UsersModule } from "../users/user.module";
import { JwtService } from "../../common/services/jwt-service";
import { PostsModule } from "../posts/post.module";

@Module({
    imports:[ TypeOrmModule.forFeature([Blog]), UsersModule, PostsModule , CqrsModule],
    providers:[BlogsRepository, BlogsQueryRepo, CreateblogUseCase, DeleteBlogUseCase, UpdateBlogUseCase,
        JwtService
    ],
    controllers:[BlogsController, BlogsSAController],
    exports: [BlogsRepository]
})
export class BlogsModule {}