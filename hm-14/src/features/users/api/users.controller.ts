import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { UserQueryType } from '../types/types';
import { UsersQueryRepo } from '../repo/users.query.repository';
import { userQueryParams } from 'src/common/helpers/queryStringModifiers';
import { Response } from 'express';
import { RouterPaths, HTTP_STATUSES } from 'src/common/utils/utils';
import { UserOutputModel, UsersWithQueryOutputModel } from './models/output/user.output.model';
import { CreateUserModel } from './models/input/create-user.input.model';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller(RouterPaths.users)
export class UsersController {
  constructor(protected usersService: UsersService,
              protected usersQueryRepo: UsersQueryRepo) { }
  // we can use @UseGuards(AuthGuard) also for the whole @Controller 
  @UseGuards(AuthGuard)
  @Get()
  async getUsers(
    @Query() query: Partial<UserQueryType>, @Res() res): Promise<UsersWithQueryOutputModel> {
    const response = await this.usersQueryRepo.getUsers(userQueryParams(query));
    return res.status(HTTP_STATUSES.OK_200).send(response);
  }
  @Post()
  async createUser(@Body() body: CreateUserModel, @Res() res): Promise<UserOutputModel> {
    // by such way we also can throw errors
    // if(11 > 10){
    //   throw new BadRequestException([
    //     {message: 'Bad blogger id', field: 'bloggerId'}
    //   ])
    // }
    const newUser = await this.usersService.createUser(body);
    return res.status(HTTP_STATUSES.CREATED_201).send(newUser);
  }
  @Delete(':id')
  // ParseIntPipe is used to transform uri string param into number 
  // async deleteUser(@Param('id' ParseIntPipe) userId: number, @Res() res: Response) {
  async deleteUser(@Param('id') userId: string, @Res() res: Response) {
    const isDeleted = await this.usersService.deleteUser(userId)
    if(isDeleted) return res.send(HTTP_STATUSES.NO_CONTENT_204);
    return res.send(HTTP_STATUSES.NOT_FOUND_404);
  }
}
