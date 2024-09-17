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

    async getCurrentUserGame(userId: string){
        const query = `
            SELECT *
            FROM public."Game"
            WHERE "status" = 'PendingSecondPlayer' OR status = 'Active' 
            AND "firstUserId" = '${userId}' OR "secondUserId" = '${userId}'
        `;
        const result = await this.dataSource.query(query);
        return result ? result[0] : null;
    }

    async getGameById(gameId: string){
        const query = `
            SELECT *
            FROM public."Game"
            WHERE "id" = '${gameId}' 
        `;
        const result = await this.dataSource.query(query);
        return result ? result[0] : null;
    }

    async getAmountOfAnswer(userId: string, gameId: string){
        const query = `
            SELECT COUNT(*)
            FROM public."Answer"
            WHERE "playerId" = '${userId}' AND "gameId" = '${gameId}';
        `;
        const result = await this.dataSource.query(query);
        return result[0].count;
    }

    async getGameAnswersOfUser(userId: string, gameId: string){
        const query = `
            SELECT "questionId", "answerStatus", "addedAt", sequence
            FROM public."Answer" 
            WHERE "playerId" = '${userId}' AND "gameId" = '${gameId}'
            ORDER BY sequence ASC
        `;
        const result = await this.dataSource.query(query);
        return result;
    }
}