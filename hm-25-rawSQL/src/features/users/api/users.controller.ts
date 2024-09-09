import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put, Query, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { UserQueryType } from '../types/types';
import { UsersQueryRepo } from '../repo/users.query.repository';
import { Response } from 'express';
import { UserOutputModel, UsersWithQueryOutputModel } from './models/output/user.output.model';
import { CreateUserModel } from './models/input/create-user.input.model';
import { CreateUserCommand, CreateUserUseCase } from '../application/use-cases/create-user.use-case';
import { CommandBus } from '@nestjs/cqrs';
import { Request } from 'express';
import { DeleteUserCommand } from '../application/use-cases/delete-user.use-case';
import { BasicAuthGuard } from '../../../common/guards/basicAuth';
import { userQueryParams } from '../../../common/helpers/queryStringModifiers';
import { RouterPaths } from '../../../common/utils/utils';

@Controller(RouterPaths.users)
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

