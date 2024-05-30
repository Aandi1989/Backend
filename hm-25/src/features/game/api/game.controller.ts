import { Controller, HttpCode, Post, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { HTTP_STATUSES, RouterPaths } from "../../../common/utils/utils";
import { CommandBus } from "@nestjs/cqrs";
import { ConnectGameCommand } from "../application/use-case/connect-game.use-case";
import { Request } from 'express';
import { AuthGuard } from "../../../common/guards/auth.guard";

@Controller(RouterPaths.pairGame)
export class GamesController {
    constructor(private commandBus: CommandBus){}
    
    @UseGuards(AuthGuard)
    @HttpCode(HTTP_STATUSES.OK_200)
    @Post('connection')
    //                         any must be replaced afterwords
    async connectToGame(@Req() req: Request): Promise<any>{
        return await this.commandBus.execute(new ConnectGameCommand(req.user))
    }
}