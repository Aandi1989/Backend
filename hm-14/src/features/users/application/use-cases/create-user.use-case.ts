import { Injectable } from "@nestjs/common";
import { CreateUserModel } from "../../api/models/input/create-user.input.model";
import { UserOutputModel } from "../../api/models/output/user.output.model";
import { Account } from "../../entities/account";
import { UsersRepository } from "../../repo/users.repository";
import * as bcrypt from 'bcrypt';
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

export class CreateUserCommand {
  constructor(public data: CreateUserModel){}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand>{
  constructor(protected usersRepository: UsersRepository) { }

  async execute(command: CreateUserCommand): Promise<UserOutputModel> {
    const { login, email, password } = command.data;

    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, passwordSalt)

    const newAccount = new Account(login, email, passwordHash, passwordSalt)
    const result = await this.usersRepository.createUser(newAccount)
    return result.data;
  }
}