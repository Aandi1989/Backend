import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/service/users.service';
import { UsersRepository } from './users/repo/users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Cat, CatSchema } from './сats/cats-schema';
import { CatsRepository } from './сats/cats-repository';
import { appConfig } from 'config';
import { UsersQueryRepo } from './users/repo/users.query.repository';
import { User, UserSchema } from './users/users.schema';
import { BlogsController } from './blogs/blogs.controller';
import { BlogsQueryRepo } from './blogs/repo/blogs.query.repository';
import { Blog, BlogSchema } from './blogs/blogs.schema';
import { BlogsService } from './blogs/service/blogs.service';
import { BlogsRepository } from './blogs/repo/blogs.repository';
import { PostsQueryRepo } from './posts/repo/posts.query.repository';
import { Post, PostSchema } from './posts/posts.schema';
import { PostsController } from './posts/posts.controller';
import { PostsService } from './posts/service/posts.service';
import { PostsRepository } from './posts/repo/posts.repository';
import { CommentSchema, Comment } from './comments/comments.schema';
import { CommentsController } from './comments/comments.controller';
import { CommentsQueryRepo } from './comments/repo/comments.query.repository';
import { DeleteAllDataController } from './deleteAll/deleteAll.controller';
import { CommentsRepository } from './comments/repo/comments.repository';

@Module({
  imports: [
    MongooseModule.forRoot(appConfig.MONGO_URL || 'mongodb://0.0.0.0:27017', {
      dbName: 'hm-10-test',
      // dbName: 'hm-10',
    }),
    MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }, { name: User.name, schema: UserSchema },
    { name: Blog.name, schema: BlogSchema }, { name: Post.name, schema: PostSchema}, {name: Comment.name, schema: CommentSchema}]),
  ],
  controllers: [AppController, UsersController, BlogsController, PostsController, CommentsController, DeleteAllDataController],
  providers: [AppService, UsersService, UsersRepository, UsersQueryRepo, BlogsService, BlogsQueryRepo, BlogsRepository,
    PostsQueryRepo, PostsRepository, PostsService, CommentsQueryRepo, CommentsRepository, CatsRepository],
})
export class AppModule { }
