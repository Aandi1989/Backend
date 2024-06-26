import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../domain/users.schema';
import { Account } from '../entities/account';
import { Result, ResultCode } from 'src/common/types/types';
import { UserOutputModel } from '../api/models/output/user.output.model';


@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name)
    private UserModel: Model<User>,
  ) { }

  async createUser(newAccount: Account): Promise<Result> {
    const result = await this.UserModel.insertMany([newAccount]);
    const userOutput = this._mapDBAccountToUserOutputType(newAccount);
    return { code: ResultCode.Success, data: userOutput }
  }
  async deleteUser(id: string): Promise<boolean> {
    const result = await this.UserModel.deleteOne({ 'accountData.id': id })
    return result.deletedCount === 1;
  }
  async deleteAllData(){
    await this.UserModel.deleteMany({});
  }
  _mapDBAccountToUserOutputType(user: Account): UserOutputModel {
    return {
      id: user.accountData.id,
      login: user.accountData.login,
      email: user.accountData.email,
      createdAt: user.accountData.createdAt
    }
  }
}
