import { ObjectId } from "mongodb";
import { add } from "date-fns";
import { UserType } from "../types/types";
import {v4 as uuidv4} from 'uuid';

export class Account {
    _id: ObjectId;
    accountData: UserType;
    emailConfirmation: {
        confirmationCode: string,
        expirationDate: Date,
        isConfirmed: boolean
    };
    codeRecoveryInfo: {
        recoveryCode: string,
        expirationDate: Date,
        isConfirmed: boolean
    };
    
    constructor(
        login: string,
        email: string,
        passwordHash: string,
        passwordSalt: string,
    ) {
        this._id = new ObjectId(),
        this.accountData = {
            id: (+new Date()).toString(),
            login,
            email,
            passwordHash,
            passwordSalt,
            createdAt: new Date().toISOString(),
        },
        this.emailConfirmation = {
            confirmationCode: uuidv4(),
            expirationDate: add (new Date(), {
                            hours:1,
                            minutes: 3
                        }),
            isConfirmed: false,
        }
        this.codeRecoveryInfo = {
            recoveryCode: uuidv4(),
            expirationDate: add (new Date(), {
                hours:1,
                minutes: 3
            }),
            isConfirmed: false
        }
    }; 
}