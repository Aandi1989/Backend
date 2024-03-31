import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../domain/users.schema';
import { UserQueryOutputType } from '../types/types';
import { UserAuthOutputModel, UserOutputModel, UsersWithQueryOutputModel } from '../api/models/output/user.output.model';

@Injectable()
export class UsersQueryRepo {
  constructor(
    @InjectModel(User.name)
    private UserModel: Model<User>,
  ) { }
  async getUsers(query: UserQueryOutputType): Promise<UsersWithQueryOutputModel> {
    const { pageNumber, pageSize, searchLoginTerm, searchEmailTerm, sortBy, sortDirection } = query;
    const sortDir = sortDirection == 'asc' ? 1 : -1;
    const skip = (pageNumber - 1) * pageSize;
    let searchFilter = {};
    if (searchLoginTerm || searchEmailTerm) {
      const orConditions: any = [];
      if (searchLoginTerm) {
        orConditions.push({
          'accountData.login': { $regex: new RegExp(searchLoginTerm, 'i') },
        });
      }
      if (searchEmailTerm) {
        orConditions.push({
          'accountData.email': { $regex: new RegExp(searchEmailTerm, 'i') },
        });
      }
      searchFilter = { $or: orConditions };
    }
    const totalCount = await this.UserModel.countDocuments(searchFilter);
    const dbUsers = await this.UserModel
      .find(searchFilter)
      .sort({ [`accountData.${sortBy}`]: sortDir })
      .skip(skip)
      .limit(pageSize)
      .lean();
    const pagesCount = Math.ceil(totalCount / pageSize);
    return {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: dbUsers.map(dbUser => {
        return this._mapDBAccountToUserOutputType(dbUser)
      })
    }
  }
  async getUserById(id: string): Promise<UserOutputModel | null>{
    let dbUser: User | null = await this.UserModel.findOne({'accountData.id': id})
    return dbUser ? this._mapDBAccountToUserOutputType(dbUser) : null;
}
async getByLoginOrEmail(loginOrEmail:string): Promise<User | null>{
  let user = await this.UserModel.findOne({ $or: [ { 'accountData.email': loginOrEmail}, {'accountData.login': loginOrEmail}]})
  return user;
}
  _mapDBAccountToUserOutputType(user: User): UserOutputModel {
    return {
      id: user.accountData.id,
      login: user.accountData.login,
      email: user.accountData.email,
      createdAt: user.accountData.createdAt
    }
  }
  _mapDBAccountToUserAuthType(user: User): UserAuthOutputModel {
    return {
      userId: user.accountData.id,
      login: user.accountData.login,
      email: user.accountData.email,
    }
  }
}
