import { emailManager } from "../managers/email-manager"


class BusinessService  {
    async regConfirm(){
        // save to repo 
        // get user from repo
        // await emailManager.sendConfirmationEmail(user)
    }
}

export const businessService = new BusinessService();