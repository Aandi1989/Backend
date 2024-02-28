import { AuthBodyModel } from "../features/auth/Models/AuthBodyModel";
import { CreateUserModel } from "../features/users/models/CreateUserModel"; 
import { usersRepository } from "../repositories/users-db-repository";
import { usersQueryRepo } from "../repositories/usersQueryRepository";
import { UserType } from "../types";
import bcrypt from 'bcrypt';

export const usersService = {
    async createUser(data: CreateUserModel): Promise<UserType>{
        const {login, email, password} = data;

        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await this._generateHash(password, passwordSalt)

        const newUser = {
            id: (+new Date()).toString(),
            login,
            email,
            passwordHash,
            passwordSalt,
            createdAt: new Date().toISOString(),
        };
        const createdUser = await usersRepository.createUser(newUser)
        return newUser;
    },
    async checkCredentials(data: AuthBodyModel){
        const user = await usersQueryRepo.findByLoginOrEmail(data.loginOrEmail)
        if(!user){
            return false ;
        }
        const passwordHash = await this._generateHash( data.password, user.passwordSalt)
        if(user.passwordHash !== passwordHash){
            return false
        }
        return true
    },
    async deleteUser(id: string): Promise<boolean> {
        return await usersRepository.deleteUser(id)
    },
    async _generateHash(password: string, salt: string){
        const hash = await bcrypt.hash(password, salt)
        return hash
    }
} 

