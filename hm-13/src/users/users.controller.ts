import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res } from '@nestjs/common';
import { UsersService } from './service/users.service';
// import { RequestWithQuery } from 'src/types/types';
import { CreateUserModel, UserQueryType } from './types/types';
import { UsersQueryRepo } from './repo/users.query.repository';
import { userQueryParams } from 'src/helpers/queryStringModifiers';
import { HTTP_STATUSES } from 'src/utils';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(protected usersService: UsersService,
    protected usersQueryRepo: UsersQueryRepo) { }
  @Get()
  async getUsers(
    // @Req() req: RequestWithQuery<Partial<UserQueryType>>,
    @Query() query: Partial<UserQueryType>, @Res() res: Response) {
    const response = await this.usersQueryRepo.getUsers(userQueryParams(query));
    res.status(HTTP_STATUSES.OK_200).send(response);
  }
  @Post()
  async createUser(@Body() body: CreateUserModel, @Res() res: Response) {
    const newUser = await this.usersService.createUser(body);
    res.status(HTTP_STATUSES.CREATED_201).send(newUser);
  }
  @Delete(':id')
  async deleteUser(@Param('id') userId: string, @Res() res: Response) {
    const isDeleted = await this.usersService.deleteUser(userId)
    if(isDeleted) return res.send(HTTP_STATUSES.NO_CONTENT_204);
    return res.send(HTTP_STATUSES.NOT_FOUND_404);
  }
  // must be deleted before tests
  @Get(':id')
  getUser(@Param('id') userId: string) {
    return [{ id: 1 }, { id: 2 }].find((u) => u.id === +userId);
  }
  //--------------------------------
  // must be deleted before tests
  @Put(':id')
  updateUser(
    @Param('id') userId: string,
    @Body() model: CreateUserInputModelType,
  ) {
    return {
      id: userId,
      model: model,
    };
  }
  //--------------------------------
}

type CreateUserInputModelType = {
  name: string;
  childrenCount: number;
};
