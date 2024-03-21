import bcrypt from 'bcrypt';
import { add } from 'date-fns/add';
import { v4 as uuidv4 } from 'uuid';
import { accountExistError, codeAlredyConfirmed, codeDoesntExist, codeExpired, emailAlredyConfirmed, emailDoesntExist, recoveryCodeDoesntExist } from "../assets/errorMessagesUtils";
import { CreateUserModel } from "../features/users/models/CreateUserModel";
import { emailManager } from "../managers/email-manager";
import { AuthRepository } from "../repositories/auth-db-repository";
import { AuthQueryRepo } from "../repositories/authQueryRepository";
import { UsersRepository } from "../repositories/users-db-repository";
import { Result, ResultCode, apiCallType, refreshTokenType, sessionType } from "../types/types";
import { JwtService } from '../application/jwt-service';
import { User } from '../features/users/entities/user';
import { injectable } from 'inversify';

@injectable()
export class AuthService {
    constructor(protected usersRepository: UsersRepository,
                protected authRepository: AuthRepository,
                protected authQueryRepo: AuthQueryRepo,
                protected jwtService: JwtService){}
    async createUserAccount(data: CreateUserModel): Promise<Result>{
        const {login, email, password} = data;

        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await this._generateHash(password, passwordSalt)

        const newAccount = new User (login, email, passwordHash, passwordSalt)
        
        const existedUser = await this.authQueryRepo.findByLoginOrEmail(email, login);
        if(existedUser) {
            let result = existedUser.accountData.email === email
            ?  {code: ResultCode.Forbidden, errorsMessages: accountExistError('email', email)}
            :  {code: ResultCode.Forbidden, errorsMessages: accountExistError('login', login)};
            return result;
        }
        const createdUser = await this.usersRepository.createUser(newAccount);
        try {
            // comented to avoid annoying messages during testing
            // await emailManager.sendConfirmationEmail(newAccount);
        } catch (error) {
            console.log(error)
            return {code: ResultCode.Failed};
        }
        return createdUser;
    }

    async confirmEmail(code: string): Promise<Result>{
        const account = await this.authQueryRepo.findByConfirmationCode(code);
        if(!account) return {code: ResultCode.Failed, errorsMessages: codeDoesntExist(code)};
        if(account.emailConfirmation.isConfirmed) return {code: ResultCode.AlredyConfirmed, errorsMessages: codeAlredyConfirmed(code)};
        if(account.emailConfirmation.expirationDate < new Date()) return {code: ResultCode.Failed, errorsMessages: codeExpired(code)};
        return this.authRepository.confirmEmail(account._id)
    }

    async resendEmail(email: string): Promise<Result>{
        const account = await this.authQueryRepo.findByLoginOrEmail(email)
        if(!account) return {code: ResultCode.Failed, errorsMessages: emailDoesntExist(email)};
        if(account.emailConfirmation.isConfirmed) return {code: ResultCode.Failed, errorsMessages: emailAlredyConfirmed(email)};
        const newConfirmationCode = uuidv4();
        const updatedAccountData = await this.authRepository.updateConfirmationCode(account._id, newConfirmationCode);
        try {
            // comented to avoid annoying messages during testing
            // await emailManager.resendConfirmationalEmail(email, newConfirmationCode)
        } catch (error) {
            console.log(error)
            return {code: ResultCode.Failed};
        }
        return updatedAccountData;
    }

    async sendRecoveryCode(email: string): Promise<Result>{
        const account = await this.authQueryRepo.findByLoginOrEmail(email)
        if(!account) return {code: ResultCode.NotFound};
        const newCodeData = {
            recoveryCode: uuidv4(),
            expirationDate: add (new Date(), { minutes: 10 }),
            isConfirmed: false
        };
        const updatedUser = await this.usersRepository.updateCodeRecovery(account._id, newCodeData);
        try {
            // comented to avoid annoying messages during testing
            // await emailManager.sendRecoveryCode(email, newCodeData.recoveryCode)
        } catch (error) {
            console.log(error)
            return {code: ResultCode.Failed};
        }
        return {code: ResultCode.Success};
    }

    async changePassword(newPassword: string, recoveryCode: string): Promise<Result>{
        const account = await this.authQueryRepo.findByRecoveryCode(recoveryCode);
        if(!account) return {code: ResultCode.NotFound, errorsMessages: recoveryCodeDoesntExist(recoveryCode)};
        if( new Date() > account!.codeRecoveryInfo!.expirationDate!) return {code: ResultCode.Expired};
        if(account.codeRecoveryInfo.isConfirmed) return {code: ResultCode.Forbidden};

        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await this._generateHash(newPassword, passwordSalt);
        const updatedUser = await this.usersRepository.changePassword(account._id, passwordSalt, passwordHash);
        return {code: ResultCode.Success};
    }

    async checkRefreshToken(token: string): Promise<Result>{
        const tokenData = await this.jwtService.getRefreshTokenData(token);
        if(!tokenData.userId) return {code:ResultCode.NotFound};
        const tokenExist = await this.authQueryRepo
            .getSession(tokenData.userId, tokenData.deviceId, new Date(tokenData.iat*1000).toISOString());
        if(!tokenExist) return {code: ResultCode.Forbidden};
        if(tokenData.message === 'jwt expired') return {code: ResultCode.Expired}
        return {code: ResultCode.Success}
    }

    async revokeSession(token: string){
        const tokenData = await this.jwtService.getRefreshTokenData(token);
        const revokedSession = await this.authRepository.revokeSession(tokenData);
        return revokedSession;
    }

    async refreshToken(token: string, ip: string){
        const tokenData = await this.jwtService.getRefreshTokenData(token);
        const newAccessToken = await this.jwtService.createAccessToken(tokenData.userId);
        const newRefreshToken = await this.jwtService.createRefreshToken(tokenData.userId, tokenData.deviceId);
        const newTokenData = await this.jwtService.getRefreshTokenData(newRefreshToken.refreshToken)
        const updatedSession = await this.authRepository
            .updateSession(tokenData, newTokenData, ip);
        return {newAccessToken, newRefreshToken}
    }

    async addRequest(request: apiCallType){
        const addedRequest = await this.authRepository.addRequest(request);
        return addedRequest;
    }

    async createSession(refreshToken: string, ip: string, deviceName: string = 'unknown'){
        const {userId, deviceId, iat, exp } = await this.jwtService.getRefreshTokenData(refreshToken);
        const newSession: sessionType = {
            userId,
            deviceId,
            iat: new Date(iat * 1000).toISOString(),
            deviceName,
            ip,
            exp: new Date(exp * 1000).toISOString()
        }
        const creeatedSession = await this.authRepository.createSession(newSession);
        return creeatedSession;
    }

    async _generateHash(password: string, salt: string){
        const hash = await bcrypt.hash(password, salt)
        return hash
    }
}

