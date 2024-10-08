import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { GameQueryOutputType, GameType, UserWaitingForGame } from "../types/types";
import { GameInitialOutputModel, GameOutputModel } from "../api/modules/output/game.output.model";
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
            WHERE ("status" = 'PendingSecondPlayer' OR status = 'Active') 
            AND ("firstUserId" = '${userId}' OR "secondUserId" = '${userId}')
        `;
        const result = await this.dataSource.query(query);
        return result ? result[0] : null;
    }

    async getGameById(gameId: string){
        try{
            const query = `
                SELECT *
                FROM public."Game"
                WHERE "id" = '${gameId}' 
            `;
            const result = await this.dataSource.query(query);
            return result ? result[0] : null;
        }catch(error){
            console.log("Error trying to get user game by Id:", error);
            return null;
        }
    }

    async getUserGames(userId: string, query: GameQueryOutputType): Promise<GameInitialOutputModel>{
        const { pageNumber, pageSize, sortBy, sortDirection } = query;
        const sortDir = sortDirection === "asc" ? "ASC" : "DESC";
        const offset = (pageNumber - 1) * pageSize;

        const totalCountQuuery = `
            SELECT COUNT(*)
            FROM public."Game"
            WHERE "firstUserId" = '${userId}' OR "secondUserId" = '${userId}' 
        `;

        const totalCountResult = await this.dataSource.query(totalCountQuuery);
        const totalCount = parseInt(totalCountResult[0].count);

        const mainQuery = `
            SELECT * 
            FROM public."Game"
            WHERE "firstUserId" = '${userId}' OR "secondUserId" = '${userId}'
            ORDER BY "${sortBy}" ${sortDir}, "pairCreatedDate" DESC
            LIMIT $1
            OFFSET $2
        `;

        const games = await this.dataSource.query(mainQuery, [pageSize, offset]);
        const pagesCount = Math.ceil(totalCount / pageSize);
        
        return {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: games
        };
    }

    async getAllGames(){
        const query = `
            SELECT *
            FROM public."Game"
        `;
        const result = await this.dataSource.query(query);
        return result;
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

    async getAnswersForUserGames(userIds: string[], gameIds: string[]){
        const query = `
            SELECT *
            FROM public."Answer"
            WHERE "gameId" = ANY($1) AND "playerId" = ANY($2)
            ORDER BY sequence ASC
        `;
        const result = await this.dataSource.query(query, [gameIds, userIds]);
        return result;
    }

    async getUserStatistic(userId: string){
        const query = `
            SELECT *
            FROM public."Game"
            WHERE "firstUserId" = '${userId}' OR "secondUserId" = '${userId}'
        `;
        const result = await this.dataSource.query(query);
        return result;
    }
}