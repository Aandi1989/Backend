import { emailManager } from "../managers/email-manager"
import { injectable } from 'inversify';

@injectable()
export class BusinessService  {
    async regConfirm(){
        // save to repo 
        // get user from repo
        // await emailManager.sendConfirmationEmail(user)
    }
}
