import { add } from "date-fns";
import {v4 as uuidv4} from 'uuid';

export class Account {
    id:string
    createdAt:string
    confirmationCode?: string
    confCodeExpDate?: string
    confCodeConfirmed?: boolean
    recoveryCode?: string
    recCodeExpDate?: string
    recCodeConfirmed?: boolean
    
    constructor(
        public login: string,
        public email: string,
        public passwordHash: string,
        public passwordSalt: string,
    ) {
        this.id = uuidv4();
        this.createdAt = new Date().toISOString();    
        this.confirmationCode = uuidv4();
        this.confCodeExpDate = add (new Date(), {
                            hours:1,
                            minutes: 3
        }).toISOString();
        this.confCodeConfirmed = false;
        this.recoveryCode = uuidv4();
        this.recCodeExpDate = add (new Date(), {
                hours:1,
                minutes: 3
            }).toISOString(),
        this.recCodeConfirmed = false;
        }
    }; 
