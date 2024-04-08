import { Injectable } from "@nestjs/common";
import { Result, ResultCode } from "src/common/types/types";
import { CodeRecoveryModel } from "../api/models/input/recovery.code.model";
import { DataSource } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";


@Injectable()
export class AuthRepository {
    constructor(@InjectDataSource() protected dataSourse: DataSource) { }
    
    async confirmEmail(id: string): Promise<Result>{
       const query = `
        UPDATE public."Users"
        SET "confCodeConfirmed" = 'true'
        WHERE "id" = '${id}'
       `;
       const result = await this.dataSourse.query(query);
       return result[1] === 1 ? {code: ResultCode.Success} : {code: ResultCode.Failed};
    }
    async updateConfirmationCode(id: string, newCode: string): Promise<Result>{
        const query = `
        UPDATE public."Users"
        SET "confirmationCode" = '${newCode}'
        WHERE "id" = '${id}'
       `;
       const result = await this.dataSourse.query(query);
       return result[1] === 1 ? {code: ResultCode.Success} : {code: ResultCode.Failed};
    }
    async updateCodeRecovery( id: string, codeDate: CodeRecoveryModel){
        const { recoveryCode, recCodeExpDate, recCodeConfirmed } = codeDate;
        const query = `
            UPDATE public."Users"
            SET "recoveryCode" = '${recoveryCode}', "recCodeExpDate" = '${recCodeExpDate}', "recCodeConfirmed" = '${recCodeConfirmed}'
            WHERE "id" = '${id}'
        `;
        const result = await this.dataSourse.query(query);
        return result[1] === 1;
    }
    async changePassword(id: string, passwordSalt: string, passwordHash: string){
        const query = `
            UPDATE public."Users"
            SET "passwordSalt" = '${passwordSalt}', "passwordHash" = '${passwordHash}'
            WHERE "id" = '${id}'
        `;
        const result = await this.dataSourse.query(query);
        return result[1] === 1;
    }
}
