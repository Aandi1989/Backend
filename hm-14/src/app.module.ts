import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { appConfig } from 'config';
import { PostsQueryRepo } from './features/posts/repo/posts.query.repository';
import { Post, PostSchema } from './features/posts/domain/posts.schema';
import { PostsController } from './features/posts/api/posts.controller';
import { PostsService } from './features/posts/application/posts.service';
import { PostsRepository } from './features/posts/repo/posts.repository';
import { DeleteAllDataController } from './features/deleteAll/deleteAll.controller';
import { BlogsController } from './features/blogs/api/blogs.controller';
import { BlogsService } from './features/blogs/application/blogs.service';
import { Blog, BlogSchema } from './features/blogs/domain/blogs.schema';
import { BlogsQueryRepo } from './features/blogs/repo/blogs.query.repository';
import { BlogsRepository } from './features/blogs/repo/blogs.repository';
import { CommentsController } from './features/comments/api/comments.controller';
import { CommentSchema, Comment } from './features/comments/domain/comments.schema';
import { CommentsQueryRepo } from './features/comments/repo/comments.query.repository';
import { CommentsRepository } from './features/comments/repo/comments.repository';
import { UsersController } from './features/users/api/users.controller';
import { UsersService } from './features/users/application/users.service';
import { User, UserSchema } from './features/users/domain/users.schema';
import { UsersQueryRepo } from './features/users/repo/users.query.repository';
import { UsersRepository } from './features/users/repo/users.repository';
import { CreateUserUseCase } from './features/users/application/use-cases/create-user.use-case';
import { CqrsModule } from '@nestjs/cqrs';
import { DeleteUserUseCase } from './features/users/application/use-cases/delete-user.use-case';
import { CreatePostUseCase } from './features/posts/application/use-cases/create-post.use-case';
import { DeletePostUseCase } from './features/posts/application/use-cases/delete-post.use-case';
import { UpdatePostUseCase } from './features/posts/application/use-cases/update-post.use-case';
import { CreateblogUseCase } from './features/blogs/application/use-case/create-blog.use-case';
import { DeleteBlogUseCase } from './features/blogs/application/use-case/delete-blog.use-case';
import { UpdateBlogUseCase } from './features/blogs/application/use-case/update-blog.use-case';
import { JwtService } from './common/services/jwt-service';
import { Like, LikeSchema } from './features/posts/domain/likes.schema';
import { AliCallSchema, ApiCall } from './features/auth/domain/apiCall.schema';
import { Session, SessionSchema } from './features/security/domain/session.schema';
import { AuthService } from './features/auth/application/auth.service';
import { AuthController } from './features/auth/api/auth.controller';
import { CheckCredentialsUseCase } from './features/auth/application/use-case/check-credentials.use-case';
import { CreateSessionUseCase } from './features/security/application/use-case/create-session.use-case';
import { SecurityRepository } from './features/security/repo/security.repository';
import { CheckRefreshTokenUseCase } from './features/security/application/use-case/check-refreshToken.use-case';
import { SecurityQueryRepo } from './features/security/repo/security.query.repository';
import { RevokeSessionUseCase } from './features/security/application/use-case/revoke-session.use-case';
import { RefreshTokensUseCase } from './features/blogs/application/use-case/refresh-tokens.use-case';
import { AuthQueryRepo } from './features/auth/repo/auth.query.repo';
import { CreateAccountUseCase } from './features/auth/application/use-case/create-account.use-case';
import { ConfirmEmailUseCase } from './features/auth/application/use-case/confirm-email.use-case';

const schemas = [{ name: User.name, schema: UserSchema }, { name: Blog.name, schema: BlogSchema },
{ name: Post.name, schema: PostSchema }, { name: Comment.name, schema: CommentSchema },
{ name: Like.name, schema: LikeSchema }, { name: ApiCall.name, schema: AliCallSchema},
{ name: Session.name, schema: SessionSchema}];

const controllers = [AppController, UsersController, BlogsController, PostsController,
  CommentsController, DeleteAllDataController, AuthController];

const providers = [AppService, UsersService, UsersRepository, UsersQueryRepo, BlogsService, BlogsQueryRepo,
  BlogsRepository, PostsQueryRepo, PostsRepository, PostsService, CommentsQueryRepo, CommentsRepository, JwtService,
  AuthService, SecurityRepository, SecurityQueryRepo, AuthQueryRepo];

const useCases = [CreateUserUseCase, DeleteUserUseCase, CreatePostUseCase, DeletePostUseCase, UpdatePostUseCase,
  CreateblogUseCase, DeleteBlogUseCase, UpdateBlogUseCase, CheckCredentialsUseCase, CreateSessionUseCase, 
  CheckRefreshTokenUseCase, RevokeSessionUseCase, RefreshTokensUseCase, CreateAccountUseCase, ConfirmEmailUseCase]

@Module({
  imports: [
    MongooseModule.forRoot(appConfig.MONGO_URL || 'mongodb://0.0.0.0:27017', {
      // dbName: 'hm-10-test',
      dbName: 'hm-10',
    }),
    MongooseModule.forFeature(schemas),
    CqrsModule
  ],
  controllers: [...controllers],
  providers: [...providers, ...useCases],
})
export class AppModule { }
