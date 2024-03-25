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

@Module({
  imports: [
    MongooseModule.forRoot(appConfig.MONGO_URL || 'mongodb://0.0.0.0:27017', {
      dbName: 'hm-10-test',
    }),
    MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }, { name: User.name, schema: UserSchema}]),
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService, UsersRepository, UsersQueryRepo ,CatsRepository],
})
export class AppModule {}
