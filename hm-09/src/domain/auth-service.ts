import bcrypt from 'bcrypt';
import { add } from 'date-fns/add';
import { ObjectId } from "mongodb";
import { v4 as uuidv4 } from 'uuid';
import { accountExistError, codeAlredyConfirmed, codeDoesntExist, codeExpired, emailAlredyConfirmed, emailDoesntExist } from "../assets/errorMessagesUtils";
import { CreateUserModel } from "../features/users/models/CreateUserModel";
import { emailManager } from "../managers/email-manager";
import { authRepository } from "../repositories/auth-db-repository";
import { authQueryRepo } from "../repositories/authQueryRepository";
import { usersRepository } from "../repositories/users-db-repository";
import { Result, ResultCode, UserAccountDBType, apiCallType, refreshTokenType } from "../types/types";
import { jwtService } from '../application/jwt-service';

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
        const existedUser = await authQueryRepo.findByLoginOrEmail(email, login);
        if(existedUser) {
            let result = existedUser.accountData.email === email
            ?  {code: ResultCode.Forbidden, errorsMessages: accountExistError('email', email)}
            :  {code: ResultCode.Forbidden, errorsMessages: accountExistError('login', login)};
            return result;
        }
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
        const account = await authQueryRepo.findByConfirmationCode(code);
        if(!account) return {code: ResultCode.Failed, errorsMessages: codeDoesntExist(code)};
        if(account.emailConfirmation.isConfirmed) return {code: ResultCode.AlredyConfirmed, errorsMessages: codeAlredyConfirmed(code)};
        if(account.emailConfirmation.expirationDate < new Date()) return {code: ResultCode.Failed, errorsMessages: codeExpired(code)};
        return authRepository.confirmEmail(account._id)
    },
    async resendEmail(email: string): Promise<Result>{
        const account = await authQueryRepo.findByLoginOrEmail(email)
        if(!account) return {code: ResultCode.Failed, errorsMessages: emailDoesntExist(email)};
        if(account.emailConfirmation.isConfirmed) return {code: ResultCode.Failed, errorsMessages: emailAlredyConfirmed(email)};
        const newConfirmationCode = uuidv4();
        const updatedAccountData = await authRepository.updateConfirmationCode(account._id, newConfirmationCode);
        try {
            await emailManager.resendConfirmationalEmail(email, newConfirmationCode)
        } catch (error) {
            console.log(error)
            return {code: ResultCode.Failed};
        }
        return updatedAccountData;
    },
    async checkRefreshToken(token: string): Promise<Result>{
        const blockedToken = await authQueryRepo.getInvalidToken(token)
        if (blockedToken) return {code: ResultCode.Forbidden};
        const tokenData = await jwtService.getRefreshTokenData(token);
        // const time = new Date (tokenData.iat * 1000).toISOString();
        if(!tokenData.userId) return {code:ResultCode.NotFound};
        if(tokenData.message === 'jwt expired') return {code: ResultCode.Expired}
        return {code: ResultCode.Success, data: tokenData.userId }
    },
    async revokeToken(token: string){
        const revokedToken = await authRepository.revokeToken(token)
        return revokedToken;
    },
    async refreshToken(token: string){
        const userData = await jwtService.getRefreshTokenData(token);
        const newAccessToken = await jwtService.createAccessToken(userData.userId);
        const newRefreshToken = await jwtService.createRefreshToken(userData.userId);
        const revokedToken = await authRepository.revokeToken(token);
        return {newAccessToken, newRefreshToken}
    },
    async addRequest(request: apiCallType){
        const addedRequest = await authRepository.addRequest(request);
        return addedRequest;

    },
    async _generateHash(password: string, salt: string){
        const hash = await bcrypt.hash(password, salt)
        return hash
    }
}
