import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repo/users.repository';

@Injectable()
export class UsersService {
  constructor(protected usersRepository: UsersRepository) {}

  findUsers(term: string) {
    return this.usersRepository.findUsers(term);
  }
}
