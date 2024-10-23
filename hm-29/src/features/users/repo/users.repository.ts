import { Injectable } from '@nestjs/common';
import { Account } from '../entities/account';
import { UserOutputModel } from '../api/models/output/user.output.model';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Result, ResultCode } from '../../../common/types/types';
import { BanUserModel } from '../api/models/input/ban-user.input.model';


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
  async banUser(userId: string, body: BanUserModel){
    const { isBanned, banReason } = body;
    
    const banDate = isBanned ? `'${new Date().toISOString()}'` : 'NULL';
    const reason = isBanned ? `'${banReason}'` : 'NULL';

    const sql = `
        UPDATE public."Users"
        SET "isBanned" = ${isBanned},
            "banDate" = ${banDate},
            "banReason" = ${reason}
        WHERE id = $1
    `;

    const result = await this.dataSourse.query(sql, [userId]);
    return result[1] === 1;
  }
  async saveTelegramActivationCode(userId: string, code: string){
    const sql = `
      UPDATE public."Users"
      SET "telegramCode" = '${code}'
      WHERE id = '${userId}'
    `;

    const result = await this.dataSourse.query(sql);
    return result[1] === 1;
  }
  async saveUserTelegramId(userId: string, telegramId: number){
    const sql = `
      UPDATE public."Users"
      SET "telegram_id" = '${telegramId}'
      WHERE id = '${userId}'
    `;
    const result = await this.dataSourse.query(sql);
    return result[1] === 1;
  }
  async deleteUser(id: string): Promise<boolean> {
    const query =
      `DELETE FROM public."Users"
      WHERE "id" = $1`;
    const result = await this.dataSourse.query(query, [id]);
    return result[1] === 1;
  }
  async deleteAllData() {
    const query = `DELETE FROM public."Users"`;
    const result = await this.dataSourse.query(query);
  }
  _mapDBAccountToUserOutputType(user: Account): UserOutputModel {
    return {
      id: user.id,
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
      banInfo: {
        banDate: null,
        banReason: null,
        isBanned: false
      }
    }
  }
}

