import { Injectable } from '@nestjs/common';
import { UserQueryOutputType, UserSQL } from '../types/types';
import { UserAuthOutputModel, UserOutputModel, UsersWithQueryOutputModel } from '../api/models/output/user.output.model';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Account } from '../entities/account';
import { MeOutputModel } from '../../auth/api/models/output/me.output.model';

@Injectable()
export class UsersQueryRepo {
  constructor(@InjectDataSource() protected dataSourse: DataSource) { }

  async getUsers(query: UserQueryOutputType): Promise<UsersWithQueryOutputModel> {
    const { pageNumber, pageSize, searchLoginTerm, searchEmailTerm, sortBy, sortDirection } = query;
    const sortDir = sortDirection === "asc" ? "ASC" : "DESC";
    const offset = (pageNumber - 1) * pageSize;
    const searchLoginParam = searchLoginTerm ? `%${searchLoginTerm}%` : `%%`;
    const searchEmailParam = searchEmailTerm ? `%${searchEmailTerm}%` : `%%`;

    const totalCountQuery = `
              SELECT COUNT(*)
              FROM public."Users"
              WHERE login ILIKE $1 OR email ILIKE $2
          `;

    const totalCountResult = await this.dataSourse.query(totalCountQuery, [searchLoginParam, searchEmailParam]);
    const totalCount = parseInt(totalCountResult[0].count);


    // postgres doesnt allow use as params names of columns that is why we validate sortBy in function blogQueryParams
    const mainQuery = `
      SELECT * FROM public."Users"
      WHERE login ILIKE $1 OR email ILIKE $2
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
    const query =
            `SELECT * 
            FROM public."Users"
            WHERE "id" = '${id}'`;
        const result = await this.dataSourse.query(query);
        return result.length != 0 ? this._mapAccountToUserOutputType(result[0]) : null;
  }
  async getByLoginOrEmail(loginOrEmail: string): Promise<Account | null> {
    const query = `
            SELECT * FROM public."Users"
            WHERE "email" = '${loginOrEmail}' OR "login" = '${loginOrEmail}'
        `;
    const foundedAccount = await this.dataSourse.query(query);
    return foundedAccount[0] as Account | null;
  }
  async getAuthById(id: string): Promise<MeOutputModel | null> {
    const query =
            `SELECT * 
            FROM public."Users"
            WHERE "id" = '${id}'`;
        const result = await this.dataSourse.query(query);
        return result ? this._mapAccountToUserAuthType(result[0]) : null;
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
