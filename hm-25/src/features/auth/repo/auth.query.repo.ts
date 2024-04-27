import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/domain/user.entity';
import { Account } from '../../users/entities/account';



@Injectable()
export class AuthQueryRepo {
    constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) { }

    async findByLoginOrEmail(email: string, login?: string): Promise<Account | null>{
        const foundedAccount = await this.usersRepository
            .createQueryBuilder("user")
            .where("user.email = :email OR user.login = :login", { email, login})
            .getOne();
        return foundedAccount;
    }
    async findByConfirmationCode(code: string): Promise<Account | null>{
       const foundedAccount = await this.usersRepository
        .createQueryBuilder("user")
        .where("user.confirmationCode = :code", {code})
        .getOne();
        return foundedAccount;
    }
    async findByRecoveryCode(recoveryCode: string): Promise<Account | null>{
       const result = await this.usersRepository.findOneBy({recoveryCode});
       return result;
    }
}
