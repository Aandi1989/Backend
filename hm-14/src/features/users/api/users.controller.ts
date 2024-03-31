import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { UserQueryType } from '../types/types';
import { UsersQueryRepo } from '../repo/users.query.repository';
import { userQueryParams } from 'src/common/helpers/queryStringModifiers';
import { Response } from 'express';
import { RouterPaths, HTTP_STATUSES } from 'src/common/utils/utils';
import { UserOutputModel, UsersWithQueryOutputModel } from './models/output/user.output.model';
import { CreateUserModel } from './models/input/create-user.input.model';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CreateUserCommand, CreateUserUseCase } from '../application/use-cases/create-user.use-case';
import { CommandBus } from '@nestjs/cqrs';
import { Request } from 'express';
import { DeleteUserCommand } from '../application/use-cases/delete-user.use-case';

@Controller(RouterPaths.users)
export class UsersController {
  constructor(protected usersService: UsersService,
    protected usersQueryRepo: UsersQueryRepo,
    private commandBus: CommandBus) { }

  // we can use @UseGuards(AuthGuard) also for the whole @Controller 
  @UseGuards(AuthGuard)
  @Get()
  async getUsers(@Req() request: Request,
    @Query() query: Partial<UserQueryType>): Promise<UsersWithQueryOutputModel> {
    // ! ip cookie deviceName url
    // console.log(request.socket.remoteAddress, request.headers['user-agent'], request.url, request.cookies)
    return await this.usersQueryRepo.getUsers(userQueryParams(query));
  }
  @UseGuards(AuthGuard)
  @Post()
  async createUser(@Body() body: CreateUserModel): Promise<UserOutputModel> {
    // by such way we also can throw errors
    // if(11 > 10){
    //   throw new BadRequestException([
    //     {message: 'Bad blogger id', field: 'bloggerId'}
    //   ])
    // }
    // ! how to set cookies
    // res.cookie('refreshToken', 'abc', { httpOnly: true, secure: true }); 
    // @Get()
    // findAll(@Res({ passthrough: true }) response: Response) {
    //   response.cookie('key', 'value')
    // }
    return await this.commandBus.execute(new CreateUserCommand(body));
  }
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  // ParseIntPipe is used to transform uri string param into number 
  // async deleteUser(@Param('id' ParseIntPipe) userId: number, @Res() res: Response) {
  async deleteUser(@Param('id') userId: string) {
    const isDeleted = await this.commandBus.execute(new DeleteUserCommand(userId));
    if(isDeleted) return;
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }
}

