import {Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res } from '@nestjs/common';
import { UsersService } from './service/users.service';
import { RequestWithQuery } from 'src/types/types';
import { UserQueryType } from './types/types';
import { UsersQueryRepo } from './repo/users.query.repository';
import { userQueryParams } from 'src/helpers/queryStringModifiers';
import { HTTP_STATUSES } from 'src/utils';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(protected usersService: UsersService,
              protected usersQueryRepo: UsersQueryRepo) {}
  @Get()
  async getUsers(
    @Req() req: RequestWithQuery<Partial<UserQueryType>>,
    @Query() query: Partial<UserQueryType>,
    @Res() res: Response ) {
      
    const response = await this.usersQueryRepo.getUsers(userQueryParams(req.query));
    res.status(HTTP_STATUSES.OK_200).json(response)
  }
  @Get(':id')
  getUser(@Param('id') userId: string) {
    return [{ id: 1 }, { id: 2 }].find((u) => u.id === +userId);
  }
  @Post()
  createUser(@Body() inputModel: CreateUserInputModelType) {
    return {
      id: 12,
      name: inputModel.name,
      childrenCount: inputModel.childrenCount,
    };
  }
  @Delete(':id')
  deleteUser(@Param('id') userId: string) {
    return [
      { id: 1, name: 'Bob' },
      { id: 2, name: 'Juan' },
    ].filter((u) => u.id != +userId);
  }
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
}

type CreateUserInputModelType = {
  name: string;
  childrenCount: number;
};
