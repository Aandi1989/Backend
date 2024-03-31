import { Body, Controller, HttpCode, Post, Req, Res, UnauthorizedException } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { JwtService } from "src/common/services/jwt-service";
import { HTTP_STATUSES, RouterPaths } from "src/common/utils/utils";
import { UsersQueryRepo } from "src/features/users/repo/users.query.repository";
import { AuthBodyModel } from "./models/input/login.input.model";
import { LoginOutputModel } from "./models/output/login.output.model";
import { CheckCredentialsCommand } from "../application/use-case/check-credentials.use-case";
import { CreateSessionCommand } from "src/features/security/application/use-case/create-session.use-case";
import { Request, Response } from 'express';



@Controller(RouterPaths.auth)
export class AuthController {
    constructor(protected jwtService: JwtService,
                protected usersQueryRepo: UsersQueryRepo,
                private commandBus: CommandBus){}
    @HttpCode(HTTP_STATUSES.OK_200)            
    @Post('login')
    async login (@Req() req: Request, @Body() body: AuthBodyModel, @Res() res: Response):Promise<LoginOutputModel>{
        const user = await this.commandBus.execute(new CheckCredentialsCommand(body));
        if(user){
            const accessToken = await this.jwtService.createAccessToken(user.accountData.id);
            const { refreshToken }  = await this.jwtService.createRefreshToken(user.accountData.id);
            const deviceName = req.headers['user-agent'];
            const ip = req.socket.remoteAddress!;
            const createdSession = await this.commandBus.execute(new CreateSessionCommand({refreshToken, ip, deviceName}))
            res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true }); 
            //@ts-ignore
            return res.send(accessToken);
        }
        throw new UnauthorizedException();
    }
}



// import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
// import { AuthBodyModel } from "../../api/models/input/login.input.model";



// export class CheckCredentialsCommand {
//     constructor(public data: AuthBodyModel){}
// }

// @CommandHandler(CheckCredentialsCommand)
// export class CheckCredentialsUseCase implements ICommandHandler<CheckCredentialsCommand>{
//     constructor(){}

//     async execute(command: CheckCredentialsCommand): Promise<any> {
        
//     }
// }