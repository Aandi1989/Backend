import { UserQueryOutputType } from "../assets/queryStringModifiers";
import { usersAcountsCollection } from "../db/db";
import { UserAccountDBType, UserAuthType, UserOutputType, UsersWithQueryType } from "../types/types";

export const usersQueryRepo = {
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
        const totalCount = await usersAcountsCollection.countDocuments(searchFilter);
        const dbUsers = await usersAcountsCollection
        .find(searchFilter)
        .sort({[`accountData.${sortBy}`]: sortDir})
        .skip(skip)
        .limit(pageSize)
        .toArray();
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
    },
    async getUserById(id: string): Promise<UserOutputType | null>{
        let dbUser: UserAccountDBType | null = await usersAcountsCollection.findOne({'accountData.id': id})
        return dbUser ? this._mapDBAccountToUserOutputType(dbUser) : null;
    },
    async getAuthById(id: string): Promise<UserAuthType | null>{
        let dbUser: UserAccountDBType | null = await usersAcountsCollection.findOne({'accountData.id': id})
        return dbUser ? this._mapDBAccountToUserAuthType(dbUser) : null;
    },
    async getByLoginOrEmail(loginOrEmail:string): Promise<UserAccountDBType | null>{
        let user = await usersAcountsCollection.findOne({ $or: [ { 'accountData.email': loginOrEmail}, {'accountData.login': loginOrEmail}]})
        return user;
    },
    async findByConfirmationCode(code: string){
        const foundedAccount = await usersAcountsCollection.findOne({"emailConfirmation.confirmationCode": code});
        return foundedAccount;
    },
    async findByLoginOrEmail(email: string){
        const foundedAccount = await usersAcountsCollection.findOne({ $or: [{'accountData.login': email}, 
                                                                            {'accountData.email': email}] });
        return foundedAccount;
    },
    _mapDBAccountToUserOutputType(user: UserAccountDBType): UserOutputType{
        return{
            id:user.accountData.id,
            login: user.accountData.login,
            email: user.accountData.email,
            createdAt: user.accountData.createdAt
        }
    },
    _mapDBAccountToUserAuthType(user: UserAccountDBType): UserAuthType{
        return {
            userId:user.accountData.id,
            login: user.accountData.login,
            email: user.accountData.email,
        }
    }
}