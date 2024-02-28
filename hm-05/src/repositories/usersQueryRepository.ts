import { UserQueryOutputType } from "../assets/queryStringModifiers";
import { usersCollection } from "../db/db";
import { DBUserType, UserOutputType, UsersWithQueryType } from "../types";

export const usersQueryRepo = {
    async getUsers(query: UserQueryOutputType): Promise<UsersWithQueryType>{
        const {pageNumber, pageSize, searchLoginTerm, sortBy, sortDirection } = query;
        const sortDir = sortDirection == "asc" ? 1 : -1;  
        const skip = (pageNumber -1) * pageSize;  
        const searchFilter = searchLoginTerm ? {
            $or: [
                { login: { $regex: new RegExp(searchLoginTerm, 'i') } },
                { email: { $regex: new RegExp(searchLoginTerm, 'i') } }
            ]
        } : {};
        const totalCount = await usersCollection.countDocuments();
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