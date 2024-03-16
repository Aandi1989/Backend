import { ObjectId } from "mongodb";
import { AuthBodyModel } from "../features/auth/Models/AuthBodyModel";
import { CreateUserModel } from "../features/users/models/CreateUserModel"; 
import { usersRepository } from "../repositories/users-db-repository";
import { usersQueryRepo } from "../repositories/usersQueryRepository";
import { UserAccountDBType, UserOutputType } from "../types/types";
import bcrypt from 'bcrypt';
import {v4 as uuidv4} from 'uuid';
import { add } from 'date-fns/add';

export const usersService = {
    async createUser(data: CreateUserModel): Promise<UserOutputType>{
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
            },
            codeRecoveryInfo: {}
        }
        const result = await usersRepository.createUser(newAccount)
        return result.data;
    },
    async checkCredentials(data: AuthBodyModel){
        const user = await usersQueryRepo.getByLoginOrEmail(data.loginOrEmail)
        if(!user){
            return false ;
        }
        const passwordHash = await this._generateHash( data.password, user.accountData.passwordSalt)
        if(user.accountData.passwordHash !== passwordHash){
            return false
        }
        return user
    },
    async deleteUser(id: string): Promise<boolean> {
        return await usersRepository.deleteUser(id)
    },
    async _generateHash(password: string, salt: string){
        const hash = await bcrypt.hash(password, salt)
        return hash
    }
} 

