import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repo/users.repository';
import { UsersQueryRepo } from '../repo/users.query.repository';
import bcrypt from 'bcrypt';
import { Account } from '../entities/account';
import { CreateUserModel } from '../api/models/input/create-user.input.model';
import { UserOutputModel } from '../api/models/output/user.output.model';


@Injectable()
export class UsersService {
  constructor(protected usersRepository: UsersRepository) { }
  // in services we leave only common logic for our use-cases 

  async deleteUser(id: string): Promise<boolean> {
    return await this.usersRepository.deleteUser(id)
  }
}
