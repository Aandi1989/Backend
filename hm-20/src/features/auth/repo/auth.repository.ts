import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Result, ResultCode } from "src/common/types/types";
import { User } from "src/features/users/domain/user.entity";
import { Repository } from "typeorm";
import { CodeRecoveryModel } from "../api/models/input/recovery.code.model";


@Injectable()
export class AuthRepository {
    constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) { }
    
    async confirmEmail(id: string): Promise<Result>{
        const result = await this.usersRepository.update(id, {confCodeConfirmed : true});
        return result.affected === 1 ? {code: ResultCode.Success} : {code: ResultCode.Failed};
     }
    async updateConfirmationCode(id: string, newCode: string): Promise<Result>{
       const result = await this.usersRepository.update(id, {confirmationCode: newCode});
       return result.affected === 1 ? {code: ResultCode.Success} : {code: ResultCode.Failed};
    }
    async updateCodeRecovery( id: string, codeDate: CodeRecoveryModel){
        const {recCodeConfirmed, recCodeExpDate, recoveryCode} = codeDate;
        const result = await this.usersRepository.update(id, {recoveryCode, recCodeExpDate, recCodeConfirmed});
       return result.affected === 1 ? {code: ResultCode.Success} : {code: ResultCode.Failed};
    }
    async changePassword(id: string, passwordSalt: string, passwordHash: string){
        const result = await this.usersRepository.update(id, {passwordHash, passwordSalt});
        return result.affected === 1;
    }
}
