import { Injectable } from '@nestjs/common';
import config from '../settings/configuration';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class TelegramService {
    private token: string;
    private serveoUrl: string;
    private axiosInstance: AxiosInstance;

    constructor() {
        this.token = config().telegramApi.TELEGRAM_API;
        this.serveoUrl = 'https://a66b1959c1e5cc96ba92eb98f945b365.serveo.net'; /*url of serveo*/
        this.axiosInstance = axios.create({
            baseURL:`https://api.telegram.org/bot${this.token}/`,
        });
    }

    async setWebhook(){
        await this.axiosInstance.post(`setWebhook`, {
            url: `${this.serveoUrl}/integrations/telegram/webhook`
        }) 
    }

    async sendMessage(text: string, recipientId: number){
        await this.axiosInstance.post(`sendMessage`, {
                chat_id: recipientId,
                text
        })
    }
    
}
