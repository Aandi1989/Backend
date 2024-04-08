import { Injectable } from '@nestjs/common';
import { Account } from '../entities/account';
import { Result, ResultCode } from 'src/common/types/types';
import { UserOutputModel } from '../api/models/output/user.output.model';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';


@Injectable()
export class UsersRepository {
  constructor(@InjectDataSource() protected dataSourse: DataSource) { }

  async createUser(newAccount: Account): Promise<Result> {
    const { id, login, email, createdAt, passwordHash, passwordSalt, confirmationCode, confCodeExpDate,
      confCodeConfirmed, recoveryCode, recCodeExpDate, recCodeConfirmed } = newAccount;
    const query = `
      INSERT INTO public."Users"(
          "id", "login", "email", "createdAt", "passwordHash","passwordSalt", "confirmationCode", 
          "confCodeExpDate", "confCodeConfirmed", "recoveryCode", "recCodeExpDate", "recCodeConfirmed")
          VALUES ('${id}', '${login}', '${email}', '${createdAt}', '${passwordHash}',
                  '${passwordSalt}', '${confirmationCode}', '${confCodeExpDate}', '${confCodeConfirmed}', '${recoveryCode}',
                  '${recCodeExpDate}', '${recCodeConfirmed}')
          RETURNING *;
  `;
    const result = await this.dataSourse.query(query);
    const userOutput = this._mapDBAccountToUserOutputType(result[0]);
    return { code: ResultCode.Success, data: userOutput }
  }
  async deleteUser(id: string): Promise<boolean> {
    const query =
      `DELETE FROM public."Users"
      WHERE "id" = $1`;
    const result = await this.dataSourse.query(query, [id]);
    return result[1] === 1;
  }
  async deleteAllData() {
    const query = `DELETE FROM public."Users`;
    const result = await this.dataSourse.query(query);
  }
  _mapDBAccountToUserOutputType(user: Account): UserOutputModel {
    return {
      id: user.id,
      login: user.login,
      email: user.email,
      createdAt: user.createdAt
    }
  }
}

