import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../domain/users.schema';
import { UserQueryOutputType, UserSQL } from '../types/types';
import { UserAuthOutputModel, UserOutputModel, UsersWithQueryOutputModel } from '../api/models/output/user.output.model';
import { MeOutputModel } from 'src/features/auth/api/models/output/me.output.model';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class UsersQueryRepo {
  constructor(
    @InjectDataSource() protected dataSourse: DataSource,
    @InjectModel(User.name) private UserModel: Model<User>,
  ) { }
  
  async getUsers(query: UserQueryOutputType): Promise<any> {
    const { pageNumber, pageSize, searchLoginTerm, searchEmailTerm, sortBy, sortDirection } = query;
    const sortDir = sortDirection === "asc" ? "ASC" : "DESC";
    const offset = (pageNumber - 1) * pageSize;
    const searchLoginParam = searchLoginTerm ? `%${searchLoginTerm}%` : `%%`;
    const searchEmailParam = searchEmailTerm ? `%${searchEmailTerm}%` : `%%`;

    const totalCountQuery = `
              SELECT COUNT(*)
              FROM public."Users"
              WHERE login ILIKE $1 AND email ILIKE $2
          `;

    const totalCountResult = await this.dataSourse.query(totalCountQuery, [searchLoginParam, searchEmailParam]);
    const totalCount = totalCountResult[0].count;

    // postgres doesnt allow use as params names of columns that is why we validate sortBy in function blogQueryParams
    const mainQuery = `
      SELECT * FROM public."Users"
      WHERE login ILIKE $1 AND email ILIKE $2
      ORDER BY "${sortBy}" ${sortDir}
      LIMIT $3
      OFFSET $4
  `;

    const users = await this.dataSourse.query(mainQuery, [searchLoginParam, searchEmailParam, pageSize, offset]);
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
    let dbUser: User | null = await this.UserModel.findOne({ 'accountData.id': id })
    return dbUser ? this._mapDBAccountToUserOutputType(dbUser) : null;
  }
  async getByLoginOrEmail(loginOrEmail: string): Promise<User | null> {
    let user = await this.UserModel.findOne({ $or: [{ 'accountData.email': loginOrEmail }, { 'accountData.login': loginOrEmail }] })
    return user;
  }
  async getAuthById(id: string): Promise<MeOutputModel | null> {
    let dbUser: User | null = await this.UserModel.findOne({ 'accountData.id': id })
    return dbUser ? this._mapDBAccountToUserAuthType(dbUser) : null;
  }
  // must be deleted after refactoring 
  _mapDBAccountToUserOutputType(user: User): UserOutputModel {
    return {
      id: user.accountData.id,
      login: user.accountData.login,
      email: user.accountData.email,
      createdAt: user.accountData.createdAt
    }
  }
  // must be deleted after refactoring 
  _mapDBAccountToUserAuthType(user: User): UserAuthOutputModel {
    return {
      userId: user.accountData.id,
      login: user.accountData.login,
      email: user.accountData.email,
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
