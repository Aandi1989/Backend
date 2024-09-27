import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtService } from './common/services/jwt-service';
import config from './common/settings/configuration';
import { AuthController } from './features/auth/api/auth.controller';
import { AuthService } from './features/auth/application/auth.service';
import { ChangeCodeUseCase } from './features/auth/application/use-case/change-code.use-case';
import { CheckCredentialsUseCase } from './features/auth/application/use-case/check-credentials.use-case';
import { ConfirmEmailUseCase } from './features/auth/application/use-case/confirm-email.use-case';
import { CreateAccountUseCase } from './features/auth/application/use-case/create-account.use-case';
import { RecoveryCodeUseCase } from './features/auth/application/use-case/recovery-code.use-case';
import { ResendEmailUseCase } from './features/auth/application/use-case/resend-email.use-case';
import { AuthQueryRepo } from './features/auth/repo/auth.query.repo';
import { AuthRepository } from './features/auth/repo/auth.repository';
import { BlogsController } from './features/blogs/api/blogs.controller';
import { BlogsService } from './features/blogs/application/blogs.service';
import { CreateblogUseCase } from './features/blogs/application/use-case/create-blog.use-case';
import { DeleteBlogUseCase } from './features/blogs/application/use-case/delete-blog.use-case';
import { RefreshTokensUseCase } from './features/blogs/application/use-case/refresh-tokens.use-case';
import { UpdateBlogUseCase } from './features/blogs/application/use-case/update-blog.use-case';
import { BlogsQueryRepo } from './features/blogs/repo/blogs.query.repository';
import { BlogsRepository } from './features/blogs/repo/blogs.repository';
import { CommentsController } from './features/comments/api/comments.controller';
import { CreateCommentUseCase } from './features/comments/application/use-case/create-comment.use-case';
import { DeleteCommentUseCase } from './features/comments/application/use-case/delete-comment.use-case';
import { LikeCommentUseCase } from './features/comments/application/use-case/like-comment.use-case';
import { UpdateCommentUseCase } from './features/comments/application/use-case/update-comment.use-case';
import { CommentsQueryRepo } from './features/comments/repo/comments.query.repository';
import { CommentsRepository } from './features/comments/repo/comments.repository';
import { DeleteAllDataController } from './features/deleteAll/deleteAll.controller';
import { LikePostUseCase } from './features/likes/application/use-cases/like-post.use-case';
import { LikesQueryRepo } from './features/likes/repo/like.query.repository';
import { LikesRepository } from './features/likes/repo/like.repository';
import { PostsController } from './features/posts/api/posts.controller';
import { PostsService } from './features/posts/application/posts.service';
import { CreatePostForBlogUseCase } from './features/posts/application/use-cases/create-post-for-blog.use-case';
import { CreatePostUseCase } from './features/posts/application/use-cases/create-post.use-case';
import { DeletePostUseCase } from './features/posts/application/use-cases/delete-post.use-case';
import { CheckPostUseCase } from './features/posts/application/use-cases/change-post.use-case';
import { PostsQueryRepo } from './features/posts/repo/posts.query.repository';
import { PostsRepository } from './features/posts/repo/posts.repository';
import { SecurytyController } from './features/security/api/security.controller';
import { AddRequestUseCase } from './features/security/application/use-case/add-request.use-case';
import { CheckRefreshTokenUseCase } from './features/security/application/use-case/check-refreshToken.use-case';
import { CheckSecurityRefreshTokenUseCase } from './features/security/application/use-case/check-security-refreshToken.use-case.';
import { CreateSessionUseCase } from './features/security/application/use-case/create-session.use-case';
import { RevokeSessionUseCase } from './features/security/application/use-case/revoke-session.use-case';
import { RevokeSessionsUseCase } from './features/security/application/use-case/revoke-sessions.use-case';
import { SecurityQueryRepo } from './features/security/repo/security.query.repository';
import { SecurityRepository } from './features/security/repo/security.repository';
import { UsersController } from './features/users/api/users.controller';
import { CreateUserUseCase } from './features/users/application/use-cases/create-user.use-case';
import { DeleteUserUseCase } from './features/users/application/use-cases/delete-user.use-case';
import { UsersService } from './features/users/application/users.service';
import { UsersQueryRepo } from './features/users/repo/users.query.repository';
import { UsersRepository } from './features/users/repo/users.repository';
import { BlogsSAController } from './features/blogs/api/blogs.sa.controller';
import { UpdatePostUseCase } from './features/posts/application/use-cases/update-post.use-case';
import { ThrottlerModule } from '@nestjs/throttler';
import { CreateQuestionUseCase } from './features/question/application/use-case/create-question.use-case';
import { DeleteQuestionUseCase } from './features/question/application/use-case/delete-question.use-case';
import { PublishQuestionUseCase } from './features/question/application/use-case/publish-question.use-case';
import { UpdateQuestionUseCase } from './features/question/application/use-case/update-question.use-case';
import { QuestionsQueryRepo } from './features/question/repo/questions.query.repository';
import { QuestionsRepository } from './features/question/repo/questions.repository';
import { QuestionsSAController } from './features/question/api/question.sa.controller';
import { GamesController } from './features/game/api/game.controller';
import { ConnectGameUseCase } from './features/game/application/use-case/connect-game.use-case';
import { GamesQueryRepository } from './features/game/repo/games.query.repository';
import { GamesRepository } from './features/game/repo/games.repository';
import { AuthModule } from './features/auth/auth.module';
import { BlogsModule } from './features/blogs/blog.module';
import { CommentsModule } from './features/comments/comment.module';
import { DeleteAllModule } from './features/deleteAll/deleteAll.module';
import { GameModule } from './features/game/game.module';
import { LikesModule } from './features/likes/like.module';
import { PostsModule } from './features/posts/post.module';
import { QuestionsModule } from './features/question/question.module';
import { SessionsModule } from './features/security/session.module';
import { UsersModule } from './features/users/user.module';



// const controllers = [AppController, UsersController, BlogsController, PostsController,
//   CommentsController, DeleteAllDataController, AuthController, SecurytyController, BlogsSAController,
//   // ---------------- added during rewriting on raw SQL
//   QuestionsSAController,
//   GamesController];

// const providers = [AppService, UsersService, UsersRepository, UsersQueryRepo, BlogsService, BlogsQueryRepo,
//   BlogsRepository, PostsQueryRepo, PostsRepository, PostsService, CommentsQueryRepo, CommentsRepository, JwtService,
//   AuthService, SecurityRepository, SecurityQueryRepo, AuthQueryRepo, AuthRepository, LikesQueryRepo, LikesRepository,
//   // ---------------- added during rewriting on raw SQL
//   QuestionsRepository, QuestionsQueryRepo, CreateQuestionUseCase, DeleteQuestionUseCase, UpdateQuestionUseCase,
//   PublishQuestionUseCase,

//   GamesRepository, GamesQueryRepository, ConnectGameUseCase];

// const useCases = [CreateUserUseCase, DeleteUserUseCase, CreatePostUseCase, DeletePostUseCase, CheckPostUseCase,
//   CreateblogUseCase, DeleteBlogUseCase, UpdateBlogUseCase, CheckCredentialsUseCase, CreateSessionUseCase,
//   CheckRefreshTokenUseCase, RevokeSessionUseCase, RefreshTokensUseCase, CreateAccountUseCase, ConfirmEmailUseCase,
//   ResendEmailUseCase, RecoveryCodeUseCase, ChangeCodeUseCase, CreateCommentUseCase, LikePostUseCase, DeleteCommentUseCase,
//   UpdateCommentUseCase, LikeCommentUseCase, CheckSecurityRefreshTokenUseCase, RevokeSessionsUseCase, AddRequestUseCase,
//   CreatePostForBlogUseCase, UpdatePostUseCase, CheckPostUseCase ]

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 10000,
      limit: 5,
    }]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    TypeOrmModule.forRoot({
      type: config().databaseSettings.DB_TYPE,
      host: config().databaseSettings.POSTGRES_DB_HOST,
      port: config().databaseSettings.POSTGRES_DB_PORT,
      username: config().databaseSettings.POSTGRES_DB_USER_NAME, 
      password: config().databaseSettings.POSTGRESS_DB_PASSWORD, 
      database: config().databaseSettings.POSTGRES_DB_DATABASE_NAME,
      ssl: {
        rejectUnauthorized: false, 
      },
      autoLoadEntities: false,
      synchronize: false,
    }),
    CqrsModule,
    SessionsModule,
    LikesModule,
    CommentsModule,
    PostsModule,
    BlogsModule,
    UsersModule,
    AuthModule,
    DeleteAllModule,
    QuestionsModule,
    GameModule,
  ]
})
export class AppModule { }

// nodejs is name of user that we created in pgAdmin 4
// to execute command below to solve problems with access rights
// GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO nodejs 
