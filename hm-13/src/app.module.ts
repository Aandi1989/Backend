import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersRepository } from './users/users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Cat, CatSchema } from './сats/cats-schema';
import { CatsRepository } from './сats/cats-repository';
import { appConfig } from 'config';

@Module({
  imports: [
    MongooseModule.forRoot(appConfig.MONGO_URL || 'mongodb://0.0.0.0:27017', {
      dbName: 'hm-10',
    }),
    MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }]),
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService, UsersRepository, CatsRepository],
})
export class AppModule {}
