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
import { JwtService } from "../../common/services/jwt-service";
import { UsersModule } from "../users/user.module";
import { PostsModule } from "../posts/post.module";
import { BloggerController } from "./api/blogs.blogger.controller";
import { UpdateOwnBlogUseCase } from "./application/use-case/update-own-blog.use-case";
import { DeleteOwnBlogUseCase } from "./application/use-case/delete-own-blog.use-case";
import { UpdateOwnPostUseCase } from "./application/use-case/update-own-post.use-case";
import { DeleteOwnPostUseCase } from "./application/use-case/delete-own-post.use-case";
import { GetSaBlogsUseCase } from "./application/use-case/get-SAblogs.use-case";
import { CommentsModule } from "../comments/comment.module";
import { UploadBlogWallpaperUseCase } from "./application/use-case/upload-blog-wallpaper.use-case";
import { DeleteImageUseCase } from "./application/use-case/delete-blog-image.use-case";
import { S3Service } from "../../common/services/s3-service";
import { UploadBlogImageUseCase } from "./application/use-case/upload-blog-image.use-case";
import { UploadPostImageUseCase } from "./application/use-case/upload-post-image.use-case";
import { SubscribeBlogUseCase } from "./application/use-case/subscribe-blog.use-case";
import { UnsubscribeBlogUseCase } from "./application/use-case/unsubscribe-blog.use-case";
import { PostNotificationUseCase } from "./application/use-case/post-notification.use-case";
import { TelegramService } from "../../common/services/telegram-service";

@Module({
    imports:[ TypeOrmModule.forFeature(), CqrsModule, UsersModule, PostsModule, CommentsModule],
    providers:[BlogsRepository, BlogsQueryRepo, CreateblogUseCase, DeleteBlogUseCase, UpdateBlogUseCase,
        UpdateOwnBlogUseCase, DeleteOwnBlogUseCase, UpdateOwnPostUseCase, DeleteOwnPostUseCase, 
        GetSaBlogsUseCase, UploadBlogWallpaperUseCase, DeleteImageUseCase, UploadBlogImageUseCase,
        UploadPostImageUseCase, SubscribeBlogUseCase, UnsubscribeBlogUseCase, PostNotificationUseCase,
        TelegramService, JwtService, S3Service
    ],
    controllers:[BlogsController, BlogsSAController, BloggerController],
    exports: [BlogsRepository, BlogsQueryRepo]
})
export class BlogsModule {}