import { Controller, ForbiddenException, HttpCode, Post, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { HTTP_STATUSES, RouterPaths } from "../../../common/utils/utils";
import { CommandBus } from "@nestjs/cqrs";
import { ConnectGameCommand } from "../application/use-case/connect-game.use-case";
import { Request } from 'express';
import { AuthGuard } from "../../../common/guards/auth.guard";
import { Result, ResultCode } from "../../../common/types/types";
import { GameOutputModel } from "./modules/output/game.output.model";

@Controller(RouterPaths.pairGame)
export class GamesController {
    constructor(private commandBus: CommandBus){}
    
    @UseGuards(AuthGuard)
    @HttpCode(HTTP_STATUSES.OK_200)
    @Post('/connection')
    
    async connectToGame(@Req() req: Request): Promise<GameOutputModel | undefined>{
        const result = await this.commandBus.execute(new ConnectGameCommand(req.user));
        if (result.code == ResultCode.Success){ return result.data};
        if (result.code == ResultCode.Forbidden) throw new ForbiddenException();
    }
}

// Fabi token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4MGEyYjRkNi1mMDA5LTQ3MjUtYjc5Ny1mMmRlZTg5NGQwMGEiLCJpYXQiOjE3MTczMjIxNTEsImV4cCI6MTcyMDAwMDU1MX0.LlTQ1yDpxw1cLscuZ-wCwrYP4D06PcXJ6mp6yc7upYQ
// Magnus token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzNTQ1YmFkMi0wYWE1LTRiYzQtYjAwNC0yYWZjYWVmNWZlNTgiLCJpYXQiOjE3MTczMTYwMjksImV4cCI6MTcxOTk5NDQyOX0.hPVI471QGuudbUrrioffJmOe03xIeNiLdA7RXjysuy4