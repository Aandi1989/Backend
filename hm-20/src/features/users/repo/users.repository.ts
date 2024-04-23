import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Result, ResultCode } from 'src/common/types/types';
import { Repository } from "typeorm";
import { UserOutputModel } from '../api/models/output/user.output.model';
import { User } from '../domain/user.entity';
import { Account } from '../entities/account';


@Injectable()
export class UsersRepository {
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) { }

  async createUser(newAccount: Account): Promise<Result> {
    const result = await this.usersRepository.save(newAccount);
      const userOutput = this._mapDBAccountToUserOutputType(result);
      return { code: ResultCode.Success, data: userOutput }

  }
  async deleteUser(id: string): Promise<boolean> {
    const result = await this.usersRepository.delete(id);
    return result.affected === 1;
  }
  async deleteAllData() {
    const result = await this.usersRepository
      .createQueryBuilder()
      .delete()
      .execute();
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

