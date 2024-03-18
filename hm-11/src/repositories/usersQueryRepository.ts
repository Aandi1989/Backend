import { UserQueryOutputType } from "../assets/queryStringModifiers";
import { usersModel } from "../db/models";
import { User } from "../features/users/entities/user";
import { UserAuthType, UserOutputType, UsersWithQueryType } from "../types/types";

export class UsersQueryRepo {
    async getUsers(query: UserQueryOutputType): Promise<UsersWithQueryType>{
        const {pageNumber, pageSize, searchLoginTerm, searchEmailTerm, sortBy, sortDirection } = query;
        const sortDir = sortDirection == "asc" ? 1 : -1;  
        const skip = (pageNumber -1) * pageSize; 
        let searchFilter = {};
        if (searchLoginTerm || searchEmailTerm) {
            const orConditions = [];
            if (searchLoginTerm) {
                orConditions.push({ 'accountData.login': { $regex: new RegExp(searchLoginTerm, 'i') } });
            }
            if (searchEmailTerm) {
                orConditions.push({ 'accountData.email': { $regex: new RegExp(searchEmailTerm, 'i') } });
            }
            searchFilter = { $or: orConditions };
        }
        const totalCount = await usersModel.countDocuments(searchFilter);
        const dbUsers = await usersModel
        .find(searchFilter)
        .sort({[`accountData.${sortBy}`]: sortDir})
        .skip(skip)
        .limit(pageSize)
        .lean();
        const pagesCount = Math.ceil(totalCount / pageSize);
        return {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: dbUsers.map(dbUser => {
                return this._mapDBAccountToUserOutputType(dbUser)
            })
        }
    }

    async getUserById(id: string): Promise<UserOutputType | null>{
        let dbUser: User | null = await usersModel.findOne({'accountData.id': id})
        return dbUser ? this._mapDBAccountToUserOutputType(dbUser) : null;
    }

    async getAuthById(id: string): Promise<UserAuthType | null>{
        let dbUser: User | null = await usersModel.findOne({'accountData.id': id})
        return dbUser ? this._mapDBAccountToUserAuthType(dbUser) : null;
    }

    async getByLoginOrEmail(loginOrEmail:string): Promise<User | null>{
        let user = await usersModel.findOne({ $or: [ { 'accountData.email': loginOrEmail}, {'accountData.login': loginOrEmail}]})
        return user;
    }

    _mapDBAccountToUserOutputType(user: User): UserOutputType{
        return{
            id:user.accountData.id,
            login: user.accountData.login,
            email: user.accountData.email,
            createdAt: user.accountData.createdAt
        }
    }

    _mapDBAccountToUserAuthType(user: User): UserAuthType{
        return {
            userId:user.accountData.id,
            login: user.accountData.login,
            email: user.accountData.email,
        }
    }
}
