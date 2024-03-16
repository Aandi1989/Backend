import { emailAdapter } from "../adapters/email-adapter"
import { UserAccountDBType } from "../types/types"


export const emailManager = {
    async sendConfirmationEmail(account: UserAccountDBType){
        await emailAdapter.sendEmail(account.accountData.email, `Confirm registration`, 
        `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
        <a href='http://localhost:3000/auth/registration-confirmation?code=${account.emailConfirmation.confirmationCode}'>complete registration</a>
        </p>`)
    },
    async resendConfirmationalEmail(email: string, newCode: string){
        await emailAdapter.sendEmail(email, `Resended email`, 
        `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
        <a href='http://localhost:3000/auth/registration-confirmation?code=${newCode}'>complete registration</a>
        </p>`)
    },
    async sendRecoveryCode(email: string, recoveryCode: string){
        await emailAdapter.sendEmail(email, `Recovery code`,
        `<h1>Password recovery</h1>
        <p>To finish password recovery please follow the link below:
           <a href='https://localhost:3000/auth/password-recovery?recoveryCode=${recoveryCode}'>recovery password</a>
       </p>`)
    }
}