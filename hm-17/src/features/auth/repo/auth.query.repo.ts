import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Account } from 'src/features/users/entities/account';
import { DataSource } from 'typeorm';



@Injectable()
export class AuthQueryRepo {
    constructor(@InjectDataSource() protected dataSourse: DataSource) { }

    async findByLoginOrEmail(email: string, login?: string): Promise<Account | null>{
        const query = `
            SELECT * FROM public."Users"
            WHERE "email" = '${email}' OR "login" = '${login}'
        `;
        const foundedAccount = await this.dataSourse.query(query);
        return foundedAccount[0] as Account | null;
    }
    async findByConfirmationCode(code: string): Promise<Account | null>{
        const query = `
        SELECT * FROM public."Users"
        WHERE "confirmationCode" = '${code}'
    `;
    const foundedAccount = await this.dataSourse.query(query);
    return foundedAccount[0] as Account | null;
    }
    async findByRecoveryCode(recoveryCode: string): Promise<Account | null>{
        const query = `
        SELECT * FROM public."Users"
        WHERE "recoveryCode" = '${recoveryCode}'
    `;
    const foundedAccount = await this.dataSourse.query(query);
    return foundedAccount[0] as Account | null;
    }

}
