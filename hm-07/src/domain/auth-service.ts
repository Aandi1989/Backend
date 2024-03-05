import { ObjectId } from "mongodb";
import { CreateUserModel } from "../features/users/models/CreateUserModel";
import bcrypt from 'bcrypt';
import {v4 as uuidv4} from 'uuid';
import { add } from 'date-fns/add';
import { UserAccountDBType } from "../types/types";
import { usersRepository } from "../repositories/users-db-repository";
import { emailManager } from "../managers/email-manager";
import { usersQueryRepo } from "../repositories/usersQueryRepository";

export const authService = {
    async createUserAccount(data: CreateUserModel): Promise<UserAccountDBType | null>{
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
        const createResult = await usersRepository.createUserAccount(newAccount);
        try {
            await emailManager.sendConfirmationEmail(newAccount);
        } catch (error) {
            console.log(error)
            return null;
        }
        return createResult;
    },
    async confirmEmail(code: string): Promise<boolean>{
        const account = await usersQueryRepo.findByConfirmationCode(code);
        if(!account) return false;
        if(account.emailConfirmation.isConfirmed) return false;
        if(account.emailConfirmation.expirationDate < new Date()) return false;
        return usersRepository.confirmEmail(account._id)
    },
    async _generateHash(password: string, salt: string){
        const hash = await bcrypt.hash(password, salt)
        return hash
    }
}