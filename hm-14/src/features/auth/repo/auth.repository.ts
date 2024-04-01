import { ObjectId } from "mongodb";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "src/features/users/domain/users.schema";
import { Model } from "mongoose";
import { Result, ResultCode } from "src/common/types/types";


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
    

}
