import { UserQueryOutputType } from "../assets/queryStringModifiers";
import { usersCollection } from "../db/db";
import { DBUserType, UserOutputType, UsersWithQueryType } from "../types";

export const usersQueryRepo = {
    async getUsers(query: UserQueryOutputType): Promise<UsersWithQueryType>{
        const {pageNumber, pageSize, searchLoginTerm, searchEmailTerm, sortBy, sortDirection } = query;
        const sortDir = sortDirection == "asc" ? 1 : -1;  
        const skip = (pageNumber -1) * pageSize; 
        let searchFilter = {};
        if (searchLoginTerm || searchEmailTerm) {
            const orConditions = [];
            if (searchLoginTerm) {
                orConditions.push({ login: { $regex: new RegExp(searchLoginTerm, 'i') } });
            }
            if (searchEmailTerm) {
                orConditions.push({ email: { $regex: new RegExp(searchEmailTerm, 'i') } });
            }
            searchFilter = { $or: orConditions };
        }
        const totalCount = await usersCollection.countDocuments(searchFilter);
        const dbUsers = await usersCollection
        .find(searchFilter)
        .sort({[sortBy]: sortDir})
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
                return this._mapDBUserToUserOutputType(dbUser)
            })
        }
    },
    async findByLoginOrEmail(loginOrEmail:string): Promise<DBUserType | null>{
        let user = await usersCollection.findOne({ $or: [ { email: loginOrEmail}, {login: loginOrEmail}]})
        return user;
    },
    _mapDBUserToUserOutputType(user: DBUserType): UserOutputType{
        return{
            id:user.id,
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        }
    }
}