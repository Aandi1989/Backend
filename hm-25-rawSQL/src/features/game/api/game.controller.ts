import { Body, Controller, ForbiddenException, Get, HttpCode, NotFoundException, Post, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { HTTP_STATUSES, RouterPaths } from "../../../common/utils/utils";
import { CommandBus } from "@nestjs/cqrs";
import { ConnectGameCommand } from "../application/use-case/connect-game.use-case";
import { Request } from 'express';
import { AuthGuard } from "../../../common/guards/auth.guard";
import { Result, ResultCode } from "../../../common/types/types";
import { AnswerOutputModel, GameOutputModel } from "./modules/output/game.output.model";
import { GamesQueryRepository } from "../repo/games.query.repository";
import { GetCurrentGameCommand } from "../application/use-case/get-current-game.use-case";
import { SendAnswerCommand } from "../application/use-case/send-answer.use-case";
import { CreateAnswerDto } from "./modules/input/create-answer.dto";

@Controller(RouterPaths.pairGame)
export class GamesController {
    constructor(private commandBus: CommandBus,
                private gamesQueryRepository: GamesQueryRepository){}
    
    @UseGuards(AuthGuard)
    @HttpCode(HTTP_STATUSES.OK_200)
    @Post('/connection')
    async connectToGame(@Req() req: Request): Promise<GameOutputModel | undefined>{
        const result = await this.commandBus.execute(new ConnectGameCommand(req.user));
        if (result.code == ResultCode.Success){ return result.data};
        if (result.code == ResultCode.Forbidden) throw new ForbiddenException();
        if (result.code !== ResultCode.Success) throw new NotFoundException();
    }

    @UseGuards(AuthGuard)
    @HttpCode(HTTP_STATUSES.OK_200)
    @Post('/my-current/answer')
    async sendAnswer(@Req() req: Request, @Body() body: CreateAnswerDto): Promise<AnswerOutputModel | undefined>{
        const result = await this.commandBus.execute(new SendAnswerCommand(req.user, body));
        if (result.code == ResultCode.Success){ return result.data};
        if (result.code == ResultCode.Forbidden) throw new ForbiddenException();
        if (result.code !== ResultCode.Success) throw new NotFoundException();    
    }

    // @UseGuards(AuthGuard)
    // @HttpCode(HTTP_STATUSES.OK_200)
    // @Get('/my-current')

    // async getMyCurrentGame(@Req() req: Request): Promise<GameOutputModel>{
    //     const result = await this.commandBus.execute(new GetCurrentGameCommand(req.user));
    //     if(result.code == ResultCode.NotFound) throw new NotFoundException();

    //     return result.data;
    // }
}

// Fabi token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3NGI1YjAyMS0wMTVmLTQzMjYtOTdhZS02YjUwNDZjM2M5OTMiLCJpYXQiOjE3MjU5NDMyNjQsImV4cCI6MTcyODYyMTY2NH0.BfGxu87-c2HAcSXDfhO3vJ8gyswvGvtwIkJ0g0tNDtM
// Magnus token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0NjI3MGJhNC01NTYxLTRhNTItOWQ5NS0yZjZiNGM2N2Q0YmEiLCJpYXQiOjE3MjU5NDM1NTUsImV4cCI6MTcyODYyMTk1NX0.S1sVNdMqw4tK-HivfQeZeYjos1qxhtvThJnx2ZZMX6Y