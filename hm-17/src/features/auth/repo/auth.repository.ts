import { ObjectId } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "src/features/users/domain/users.schema";
import { Model } from "mongoose";
import { Result, ResultCode } from "src/common/types/types";
import { CodeRecoveryModel } from "../api/models/input/recovery.code.model";


@Injectable()
export class AuthRepository {
    constructor(
        @InjectModel(User.name)
        private UserModel: Model<User>,
    ) { }
    async confirmEmail(_id: ObjectId): Promise<Result>{
        const result = await this.UserModel.updateOne({_id}, {$set: {'emailConfirmation.isConfirmed': true}})
        return result.modifiedCount === 1 ? {code: ResultCode.Success} : {code: ResultCode.Failed};
    }
    async updateConfirmationCode(_id: ObjectId, newCode: string): Promise<Result>{
        const result = await this.UserModel.updateOne({_id}, {$set: {'emailConfirmation.confirmationCode': newCode}})
        return result.modifiedCount === 1 ? {code: ResultCode.Success} : {code: ResultCode.Failed};
    }
    async updateCodeRecovery( _id: ObjectId, codeDate: CodeRecoveryModel){
        const result = await this.UserModel.updateOne({_id}, {$set: {
            'codeRecoveryInfo.recoveryCode': codeDate.recoveryCode,
            'codeRecoveryInfo.expirationDate': codeDate.expirationDate,
            'codeRecoveryInfo.isConfirmed': codeDate.isConfirmed,
        }});
        return result;
    }
    async changePassword(_id: ObjectId, passwordSalt: string, passwordHash: string){
        const result = await this.UserModel.updateOne({_id},{$set: {
            'accountData.passwordHash':passwordHash,
            'accountData.passwordSalt':passwordSalt, 
            'codeRecoveryInfo.isConfirmed': true
        }});
        return result;
    }

}
