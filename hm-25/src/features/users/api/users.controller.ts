import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { BasicAuthGuard } from '../../../common/guards/basicAuth';
import { userQueryParams } from '../../../common/helpers/queryStringModifiers';
import { RouterPaths } from '../../../common/utils/utils';
import { CreateUserCommand } from '../application/use-cases/create-user.use-case';
import { DeleteUserCommand } from '../application/use-cases/delete-user.use-case';
import { UsersQueryRepo } from '../repo/users.query.repository';
import { UserQueryType } from '../types/types';
import { CreateUserModel } from './models/input/create-user.input.model';
import { UserOutputModel, UsersWithQueryOutputModel } from './models/output/user.output.model';

@Controller(RouterPaths.usersSA)
export class UsersController {
  constructor(protected usersQueryRepo: UsersQueryRepo,
            private commandBus: CommandBus) { }
 
  @UseGuards(BasicAuthGuard)
  @Get()
  async getUsers(@Query() query: Partial<UserQueryType>): Promise<UsersWithQueryOutputModel> {
    return await this.usersQueryRepo.getUsers(userQueryParams(query));
  }
  @UseGuards(BasicAuthGuard)
  @Post()
  async createUser(@Body() body: CreateUserModel): Promise<UserOutputModel> {
    return await this.commandBus.execute(new CreateUserCommand(body));
  }
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteUser(@Param('id') userId: string) {
    const isDeleted = await this.commandBus.execute(new DeleteUserCommand(userId));
    if(isDeleted) return;
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }
}

