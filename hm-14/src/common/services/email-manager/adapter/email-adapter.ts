import { appConfig } from "config";
import * as nodemailer from "nodemailer";



export const emailAdapter = {
    async sendEmail(email: string, subject: string, message: string){
        let transport = nodemailer.createTransport({
            host: "smtp.mail.ru",
            port: 465,
            secure: true, // Use `true` for port 465, `false` for all other ports
            auth: {
              user: appConfig.EMAIL_SENDER,
              pass: appConfig.EMAIL_PASSWORD, // password from mail.ru for side applications
            },
          });
        
        let info = await transport.sendMail({
            from: `My nodemailer <${appConfig.EMAIL_SENDER}>`,
            to: email, // list of receivers
            subject: subject, // Subject line
            html: message,  // html body
        })
    }
} 