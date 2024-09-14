import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { GameType, UserWaitingForGame } from "../types/types";
import { GameOutputModel } from "../api/modules/output/game.output.model";
import { UserOutputModel } from "../../users/api/models/output/user.output.model";

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
    
    async findActiveGame(userId: string): Promise<GameType | null>{
        const query = `
            SELECT *
            FROM public."Game"
            WHERE ("firstUserId" = '${userId}' OR "secondUserId" = '${userId}')
            AND ("status" = 'Active');
        `;
        const result = await this.dataSource.query(query);
        return result[0] ? result[0] : null;
    }

    async findPendingGame(): Promise<GameType | null>{
        const query = `
            SELECT *
            FROM public."Game"
            WHERE "status" = 'PendingSecondPlayer';
        `;
        const result = await this.dataSource.query(query);
        return result[0] ? result[0] : null;
    }

    async getAmountOfAnswer(userId: string, gameId: string){
        console.log('inside getAmountOfAnswer');
        const query = `
            SELECT COUNT(*)
            FROM public."Answer"
            WHERE "playerId" = '${userId}' AND "gameId" = '${gameId}';
        `;
        const result = await this.dataSource.query(query);
        // console.log('getNumberOfAnswer result-->', result);
        return result[0].count;
    }

}