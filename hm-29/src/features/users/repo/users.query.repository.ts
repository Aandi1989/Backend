import { Injectable } from '@nestjs/common';
import { BannedUsersQueryOutputType, UserQueryOutputType, UserSQL } from '../types/types';
import { BannedUserInfo, BannedUsersInfoOutputModel, UserAuthOutputModel, UserOutputModel, UsersWithQueryOutputModel } from '../api/models/output/user.output.model';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Account } from '../entities/account';
import { MeOutputModel } from '../../auth/api/models/output/me.output.model';

@Injectable()
export class UsersQueryRepo {
  constructor(@InjectDataSource() protected dataSourse: DataSource) { }

  async getUsers(query: UserQueryOutputType): Promise<UsersWithQueryOutputModel> {
    const { pageNumber, pageSize, searchLoginTerm, searchEmailTerm, sortBy, sortDirection, banStatus } = query;
    const sortDir = sortDirection === "asc" ? "ASC" : "DESC";
    const offset = (pageNumber - 1) * pageSize;
    const searchLoginParam = searchLoginTerm ? `%${searchLoginTerm}%` : `%%`;
    const searchEmailParam = searchEmailTerm ? `%${searchEmailTerm}%` : `%%`;

    let banStatusCondition = "";
    if (banStatus === 'banned') {
        banStatusCondition = ' AND "isBanned" = true';
    } else if (banStatus === 'notBanned') {
        banStatusCondition = ' AND "isBanned" = false';
    } 

    const totalCountQuery = `
              SELECT COUNT(*)
              FROM public."Users"
              WHERE (login ILIKE $1 OR email ILIKE $2) ${banStatusCondition}
          `;

    const totalCountResult = await this.dataSourse.query(totalCountQuery, [searchLoginParam, searchEmailParam]);
    const totalCount = parseInt(totalCountResult[0].count);


    // postgres doesnt allow use as params names of columns that is why we validate sortBy in function blogQueryParams
    const mainQuery = `
      SELECT * FROM public."Users"
      WHERE (login ILIKE $1 OR email ILIKE $2) ${banStatusCondition}
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
                                                                               
  async getBannedUsers(query: BannedUsersQueryOutputType, blogId: string): Promise<BannedUsersInfoOutputModel> {
    const { pageNumber, pageSize, searchLoginTerm, sortBy, sortDirection } = query;
    const sortDir = sortDirection === "asc" ? "ASC" : "DESC";
    const offset = (pageNumber - 1) * pageSize;
    const searchLoginParam = searchLoginTerm ? `%${searchLoginTerm}%` : `%%`;

    const totalCountQuery = `
              SELECT COUNT(*)
              FROM public."Users" as u
              LEFT JOIN public."BlogBans" as bb
                ON u."id" = bb."userId"
              WHERE u.login ILIKE $1 AND bb."blogId" = $2 
          `;

    const totalCountResult = await this.dataSourse.query(totalCountQuery, [searchLoginParam, blogId]);
    const totalCount = parseInt(totalCountResult[0].count);


    // postgres doesnt allow use as params names of columns that is why we validate sortBy in function blogQueryParams
    const mainQuery = `
      SELECT u."id", u."login", bb."bannedAt" as "banDate", bb."banReason"
      FROM public."Users" as u
      LEFT JOIN public."BlogBans" as bb
                ON u."id" = bb."userId"
      WHERE login ILIKE $1 AND bb."blogId" = $2 
      ORDER BY "${sortBy}" ${sortDir}
      LIMIT $3 OFFSET $4
    `;

    const users = await this.dataSourse.query(mainQuery, [searchLoginParam, blogId, pageSize, offset]);
    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: users.map(user => {
        return this._mapUserForBannedUserInfo(user)
      })
    }
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
  async getLoginsByIdArr(ids: string[]){
    const query = `
        SELECT id, login
        FROM public."Users"
        WHERE "id" = ANY($1)
      `;
    const result = await this.dataSourse.query(query, [ids]);
    return result;
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
      createdAt: user.createdAt,
      banInfo: {
        isBanned: user.isBanned,
        banDate: user.banDate,
        banReason: user.banReason
      }
    }
  }
  _mapUserForBannedUserInfo(user): BannedUserInfo {
    return {
      id: user.id,
      login: user.login,
      banInfo: {
        isBanned: true,
        banDate: user.banDate,
        banReason: user.banReason
      }
    }
  }
}
