import { ObjectId } from "mongodb";
import { AuthBodyModel } from "../features/auth/Models/AuthBodyModel";
import { CreateUserModel } from "../features/users/models/CreateUserModel"; 
import { UsersRepository } from "../repositories/users-db-repository";
import { UsersQueryRepo } from "../repositories/usersQueryRepository";
import { UserOutputType } from "../types/types";
import bcrypt from 'bcrypt';
import { User } from "../features/users/entities/user";

export class UsersService {
    usersRepository: UsersRepository;
    usersQueryRepo: UsersQueryRepo;
    constructor(){
        this.usersRepository = new UsersRepository()
        this.usersQueryRepo = new UsersQueryRepo()
    }
    async createUser(data: CreateUserModel): Promise<UserOutputType>{
        const {login, email, password} = data;

        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await this._generateHash(password, passwordSalt)

        const newAccount = new User (login, email, passwordHash, passwordSalt)
        const result = await this.usersRepository.createUser(newAccount)
        return result.data;
    }

    async checkCredentials(data: AuthBodyModel){
        const user = await this.usersQueryRepo.getByLoginOrEmail(data.loginOrEmail)
        if(!user){
            return false ;
        }
        const passwordHash = await this._generateHash( data.password, user.accountData.passwordSalt)
        if(user.accountData.passwordHash !== passwordHash){
            return false
        }
        return user
    }

    async deleteUser(id: string): Promise<boolean> {
        return await this.usersRepository.deleteUser(id)
    }

    async _generateHash(password: string, salt: string){
        const hash = await bcrypt.hash(password, salt)
        return hash
    }
} 


