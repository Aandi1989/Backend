import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repo/users.repository';
import { UsersQueryRepo } from '../repo/users.query.repository';
import bcrypt from 'bcrypt';
import { Account } from '../entities/account';
import { CreateUserModel } from '../api/models/input/create-user.input.model';
import { UserOutputModel } from '../api/models/output/user.output.model';

@Injectable()
export class UsersService {
  constructor(protected usersRepository: UsersRepository,
              protected usersQueryRepo: UsersQueryRepo) { }
 
  async createUser(data: CreateUserModel): Promise<UserOutputModel>{
    const {login, email, password} = data;

    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(password, passwordSalt)

    const newAccount = new Account (login, email, passwordHash, passwordSalt)
    const result = await this.usersRepository.createUser(newAccount)
    return result.data;
  }
  async deleteUser(id: string): Promise<boolean> {
    return await this.usersRepository.deleteUser(id)
}
  async _generateHash(password: string, salt: string){
    const hash = await bcrypt.hash(password, salt)
    return hash
}
}
