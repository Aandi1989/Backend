import { Body, Controller, Get, HttpCode, Post, UseGuards } from "@nestjs/common";
import { HTTP_STATUSES, RouterPaths } from "../../../common/utils/utils";
import axios from "axios";
import config from '../../../common/settings/configuration';
import { AuthGuard } from "../../../common/guards/auth.guard";
import { TelegramService } from "../../../common/services/telegram-service";
import { TelegramUpdateMessage } from "../../../common/types/types";




@Controller(RouterPaths.telegram)
export class TelegramController {
    constructor(private telegramService: TelegramService){}
    
    @Post('webhook')
    async telegramBot(@Body() payload: TelegramUpdateMessage){
        console.log(payload);

        if(payload.message.text === 'сколько времени?'){
            this.telegramService.sendMessage(`${new Date()}`, payload.message.from.id)
        }else{
            this.telegramService.sendMessage('Cорри, я туповат.', payload.message.from.id)

        }

        return { status: 'success' };
    }

    @UseGuards(AuthGuard)
    @HttpCode(HTTP_STATUSES.OK_200)
    @Get('auth-bot-link')
    async authTelegram(){
        
    }   
}

