import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users.schema';
import { UserAuthType, UserOutputType, UserQueryOutputType, UsersWithQueryType } from '../types/types';

@Injectable()
export class UsersQueryRepo {
  constructor(
    @InjectModel(User.name)
    private UserModel: Model<User>,
  ) { }
  async getUsers(query: UserQueryOutputType): Promise<UsersWithQueryType> {
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

  _mapDBAccountToUserOutputType(user: User): UserOutputType {
    return {
      id: user.accountData.id,
      login: user.accountData.login,
      email: user.accountData.email,
      createdAt: user.accountData.createdAt
    }
  }
  _mapDBAccountToUserAuthType(user: User): UserAuthType {
    return {
      userId: user.accountData.id,
      login: user.accountData.login,
      email: user.accountData.email,
    }
  }
}
