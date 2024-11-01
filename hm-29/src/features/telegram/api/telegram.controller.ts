import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from "@nestjs/common";
import { HTTP_STATUSES, RouterPaths } from "../../../common/utils/utils";
import { AuthGuard } from "../../../common/guards/auth.guard";
import { TelegramUpdateMessage } from "../../../common/types/types";
import { HandleTelegramUpdatesUseCase } from "../application/use-cases/handle-telegram-updates.use-cases";
import { Request } from 'express';
import {v4 as uuidv4} from 'uuid';
import { UsersRepository } from "../../users/repo/users.repository";
import { CommandBus } from "@nestjs/cqrs";
import { SaveTelegramCodeCommand } from "../../users/application/use-cases/save-telegram-code.use-case";




@Controller(RouterPaths.telegram)
export class TelegramController {
    constructor(private handleTelegramUpdatesUseCase: HandleTelegramUpdatesUseCase,
                protected commandBus: CommandBus,
    ){}
    
    @Post('webhook')
    async telegramBot(@Body() payload: TelegramUpdateMessage){
        console.log(payload);
        this.handleTelegramUpdatesUseCase.execute(payload);
        return { status: 'success' };
    }

    @UseGuards(AuthGuard)
    @HttpCode(HTTP_STATUSES.OK_200)
    @Get('auth-bot-link')
    async authTelegram(@Req() req: Request){
        const userId = req.user.id;
        const activationCode = uuidv4();

        await this.commandBus.execute(new SaveTelegramCodeCommand(userId, activationCode));

        const botLink = `https://t.me/OctoberMorningBot?start=${activationCode}`;
        return { link: botLink };
    }   
}


