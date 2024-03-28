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

const schemas = [{ name: User.name, schema: UserSchema },{ name: Blog.name, schema: BlogSchema }, 
  { name: Post.name, schema: PostSchema }, { name: Comment.name, schema: CommentSchema }];

const controllers = [AppController, UsersController, BlogsController, PostsController, 
    CommentsController, DeleteAllDataController];

const providers = [AppService, UsersService, UsersRepository, UsersQueryRepo, BlogsService, BlogsQueryRepo, 
  BlogsRepository, PostsQueryRepo, PostsRepository, PostsService, CommentsQueryRepo, CommentsRepository];

const useCases = [CreateUserUseCase]

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
