import { ObjectId } from "mongodb";
import { add } from "date-fns";
import { UserType } from "../types/types";

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
            confirmationCode: '',
            expirationDate: add (new Date(), {
                            hours:1,
                            minutes: 3
                        }),
            isConfirmed: false,
        }
        this.codeRecoveryInfo = {
            recoveryCode: '',
            expirationDate: add (new Date(), {
                hours:1,
                minutes: 3
            }),
            isConfirmed: false
        }
    }; 
}