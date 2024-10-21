import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from './common/settings/configuration';
import { ThrottlerModule } from '@nestjs/throttler';
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
import { TelegramModule } from './features/telegram/telegram.module';


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
    TelegramModule,
  ]
})
export class AppModule { }

// nodejs is name of user that we created in pgAdmin 4
// to execute command below to solve problems with access rights
// GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO nodejs 
