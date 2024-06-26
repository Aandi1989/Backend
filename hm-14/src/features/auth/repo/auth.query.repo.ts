import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/features/users/domain/users.schema';



@Injectable()
export class AuthQueryRepo {
    constructor(
        @InjectModel(User.name)
        private UserModel: Model<User>,
    ) { }

    async findByLoginOrEmail(email: string, login?: string): Promise<User | null>{
        const foundedAccount = await this.UserModel.findOne({ $or: [ { 'accountData.login': login }, 
                                                                        { 'accountData.email': email } ] });
        return foundedAccount as User | null;
    }
    async findByConfirmationCode(code: string): Promise<User | null>{
        const foundedAccount = await this.UserModel.findOne({"emailConfirmation.confirmationCode": code});
        return foundedAccount as User | null;
    }
    async findByRecoveryCode(recoveryCode: string): Promise<User | null>{
        const foundedAccount = await this.UserModel.findOne({'codeRecoveryInfo.recoveryCode': recoveryCode})
        return foundedAccount as User | null;
    }
}
