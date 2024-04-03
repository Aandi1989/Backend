import * as nodemailer from "nodemailer";
import config from '../../../settings/configuration'



export const emailAdapter = {
    async sendEmail(email: string, subject: string, message: string){
        let transport = nodemailer.createTransport({
            host: "smtp.mail.ru",
            port: 465,
            secure: true, // Use `true` for port 465, `false` for all other ports
            auth: {
              user: config().emailSetting.EMAIL_SENDER,
              pass: config().emailSetting.EMAIL_PASSWORD, // password from mail.ru for side applications
            },
          });
        
        let info = await transport.sendMail({
            from: `My nodemailer <${config().emailSetting.EMAIL_SENDER}>`,
            to: email, // list of receivers
            subject: subject, // Subject line
            html: message,  // html body
        })
    }
} 