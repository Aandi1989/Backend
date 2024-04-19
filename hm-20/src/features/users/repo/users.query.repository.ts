import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MeOutputModel } from 'src/features/auth/api/models/output/me.output.model';
import { ILike, Repository } from 'typeorm';
import { UserAuthOutputModel, UserOutputModel, UsersWithQueryOutputModel } from '../api/models/output/user.output.model';
import { User } from '../domain/user.entity';
import { Account } from '../entities/account';
import { UserQueryOutputType, UserSQL } from '../types/types';

@Injectable()
export class UsersQueryRepo {
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) { }

  async getUsers(query: UserQueryOutputType): Promise<UsersWithQueryOutputModel> {
    const { pageNumber, pageSize, searchLoginTerm, searchEmailTerm, sortBy, sortDirection } = query;
    const sortDir = sortDirection === "asc" ? "ASC" : "DESC";
    const offset = (pageNumber - 1) * pageSize;


    const totalCount = await this.usersRepository
        .createQueryBuilder("user")
        .where([{login: ILike(`%${searchLoginTerm}%`)}, {email: ILike(`%${searchEmailTerm}%`)}])
        .getCount();

    const users = await this.usersRepository
      .createQueryBuilder("user")
      .where([{login: ILike(`%${searchLoginTerm}%`)}, {email: ILike(`%${searchEmailTerm}%`)}])
      .orderBy(`user.${sortBy}`, sortDir)
      .limit(pageSize)
      .offset(offset)
      .getMany();
    
    const pagesCount = Math.ceil(totalCount / pageSize);
      return {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: users.map(user => {
        return this._mapAccountToUserOutputType(user)
      })
    };
  }
  async getUserById(id: string): Promise<UserOutputModel | null> {
      const result = await this.usersRepository.findOneBy({id: id});
      return result ? this._mapAccountToUserOutputType(result) : null;
  }
  async getByLoginOrEmail(loginOrEmail: string): Promise<Account | null> {
    const foundedAccount = await this.usersRepository
      .createQueryBuilder("user")
      .where("user.email = :loginOrEmail OR user.login = :loginOrEmail", {loginOrEmail})
      .getOne();
    return foundedAccount;
  }
  async getAuthById(id: string): Promise<MeOutputModel | null> {
      const result = await this.usersRepository.findOneBy({id: id});
      return result ? this._mapAccountToUserAuthType(result) : null;
  }
  _mapAccountToUserAuthType(user: Account): UserAuthOutputModel {
    return {
      userId: user.id,
      login: user.login,
      email: user.email,
    }
  }
  _mapAccountToUserOutputType(user: UserSQL): UserOutputModel {
    return {
      id: user.id,
      login: user.login,
      email: user.email,
      createdAt: user.createdAt
    }
  }
}
