import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { GameType, UserWaitingForGame } from "../types/types";

@Injectable()
export class GamesQueryRepository {
    constructor(@InjectDataSource() private readonly dataSource: DataSource){}
   
    async getWaitingUser(): Promise<UserWaitingForGame | null>{
        const query = 
            `SELECT * 
            FROM public."User_waiting_for_game"
        `;
        const result = await this.dataSource.query(query);
        return result[0] ? result[0] : null;
    }
    
    async findActivePair(userId: string): Promise<GameType | null>{
        const query = `
            SELECT *
            FROM public."Game"
            WHERE ("firstUserId" = '${userId}' OR "secondUserId" = '${userId}')
            AND ("status" = 'Active' OR "status" = 'PendingForSecondUser');
        `;
        const result = await this.dataSource.query(query);
        return result[0] ? result[0] : null;
    }
}