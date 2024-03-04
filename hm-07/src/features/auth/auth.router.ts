import express, { Response, Request } from "express";
import { inputValidationMiddleware } from "../../middlewares/posts-bodyValidation-middleware";
import { authValidator } from "../../middlewares/auth-bodyValidation";
import { RequestWithBody } from "../../types/types";
import { AuthBodyModel } from "./Models/AuthBodyModel";
import { usersService } from "../../domain/users-service";
import { HTTP_STATUSES } from "../../utils";
import { jwtService } from "../../application/jwt-service";
import { accessTokenGuard } from "../../middlewares/access-token-guard-middleware";
import { usersQueryRepo } from "../../repositories/usersQueryRepository";
import nodemailer from "nodemailer";
import { appConfig } from "../../../config";

export const getAuthRouter = () => {
    const router = express.Router();

    router.get('/me',
        accessTokenGuard,
        async (req: Request, res: Response) => {
            const userId = req.user?.id;

            if(!userId) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
            const me = await usersQueryRepo.getAuthById(userId) ;

            return res.status(HTTP_STATUSES.OK_200).send(me)
        }),
    router.post('/login',
        ...authValidator,
        inputValidationMiddleware,
        async(req:RequestWithBody<AuthBodyModel>, res:Response) => {
            const user = await usersService.checkCredentials(req.body)
            if(user){
                const token = await jwtService.createJWT(user)
                res.status(HTTP_STATUSES.OK_200).send(token)
            }else{
                res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
            }
        }),
    router.post('/registration',
        async (req: Request, res: Response) => {

           
            const transport = nodemailer.createTransport({
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
                to: req.body.email, // list of receivers
                subject: req.body.subject, // Subject line
                html: req.body.message,  // html body
            })

            res.send({
                "email": req.body.email,
                "message": req.body.message,
                "subject": req.body.subject
            })
        })
    return router;
}