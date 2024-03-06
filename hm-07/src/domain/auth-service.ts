import { ObjectId } from "mongodb";
import { CreateUserModel } from "../features/users/models/CreateUserModel";
import bcrypt from 'bcrypt';
import {v4 as uuidv4} from 'uuid';
import { add } from 'date-fns/add';
import { Result, ResultCode, UserAccountDBType, UserOutputType } from "../types/types";
import { usersRepository } from "../repositories/users-db-repository";
import { emailManager } from "../managers/email-manager";
import { usersQueryRepo } from "../repositories/usersQueryRepository";
import { codeAlredyConfirmed, codeDoesntExist, codeExpired, emailAlredyConfirmed, emailDoesntExist, emailExistError } from "../assets/errorMessagesUtils";

export const authService = {
    async createUserAccount(data: CreateUserModel): Promise<Result>{
        const {login, email, password} = data;

        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await this._generateHash(password, passwordSalt)

        const newAccount: UserAccountDBType = {
            _id: new ObjectId(),
            accountData: {
                id: (+new Date()).toString(),
                login,
                email,
                passwordHash,
                passwordSalt,
                createdAt: new Date().toISOString(),
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add (new Date(), {
                    hours:1,
                    minutes: 3
                }),
                isConfirmed: false
            }
        }
        const existedUser = await usersQueryRepo.findByLoginOrEmail(email);
        if(existedUser) return {code: ResultCode.Forbidden, errorsMessages: emailExistError(email)};
        const createdUser = await usersRepository.createUser(newAccount);
        try {
            await emailManager.sendConfirmationEmail(newAccount);
        } catch (error) {
            console.log(error)
            return {code: ResultCode.Failed};
        }
        return createdUser;
    },
    async confirmEmail(code: string): Promise<Result>{
        const account = await usersQueryRepo.findByConfirmationCode(code);
        if(!account) return {code: ResultCode.Failed, errorsMessages: codeDoesntExist(code)};
        if(account.emailConfirmation.isConfirmed) return {code: ResultCode.AlredyConfirmed, errorsMessages: codeAlredyConfirmed(code)};
        if(account.emailConfirmation.expirationDate < new Date()) return {code: ResultCode.Failed, errorsMessages: codeExpired(code)};
        return usersRepository.confirmEmail(account._id)
    },
    async resendEmail(email: string): Promise<Result>{
        const account = await usersQueryRepo.findByLoginOrEmail(email)
        if(!account) return {code: ResultCode.Failed, errorsMessages: emailDoesntExist(email)};
        if(account.emailConfirmation.isConfirmed) return {code: ResultCode.Failed, errorsMessages: emailAlredyConfirmed(email)};
        const newConfirmationCode = uuidv4();
        const updatedAccountData = await usersRepository.updateConfirmationCode(account._id, newConfirmationCode);
        try {
            await emailManager.resendConfirmationalEmail(email, newConfirmationCode)
        } catch (error) {
            console.log(error)
            return {code: ResultCode.Failed};
        }
        return updatedAccountData;
    },
    async _generateHash(password: string, salt: string){
        const hash = await bcrypt.hash(password, salt)
        return hash
    }
}