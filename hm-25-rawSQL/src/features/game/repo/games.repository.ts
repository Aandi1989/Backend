import { Injectable } from "@nestjs/common";
import { AnswerType, GameType, UserWaitingForGame } from "../types/types";
import { GameOutputModel } from "../api/modules/output/game.output.model";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { UserOutputModel } from "../../users/api/models/output/user.output.model";
import { Result, ResultCode } from "../../../common/types/types";

@Injectable()
export class GamesRepository {
    constructor(@InjectDataSource() private readonly dataSource: DataSource) { }

    async addUser(user: UserWaitingForGame) {
        const { id, userId } = user;
        const query =
            `INSERT INTO public."User_waiting_for_game" 
            (id, "userId")
            VALUES ('${id}', '${userId}')`;
        const result = await this.dataSource.query(query);
        return result;
    }

    async createGame(newGame: GameType, login: string) {
        const { id, firstUserId, status, pairCreatedDate, firstUserScore, secondUserScore } = newGame;
        
        const query =
            `INSERT INTO public."Game" 
            (id, "firstUserId", status, "pairCreatedDate", "firstUserScore", "secondUserScore")
            VALUES ('${id}', '${firstUserId}', '${status}', '${pairCreatedDate}',  
             '${firstUserScore}', '${secondUserScore}')
            `;
        const result = await this.dataSource.query(query);
        return this._mapCreatedGameToOutputType(result, login);
    }

    async activateGame(user: UserOutputModel, gameId: string, startDateGame: string){
        const query = 
            `UPDATE public."Game"
            SET "secondUserId"='${user.id}', "startGameDate"='${startDateGame}', status='Active'
            WHERE "id" = '${gameId}'
            `;
        const result = await this.dataSource.query(query);
        return result[1] === 1;
    }

    async updateGameScore(gameId: string, isFirstUser: boolean):  Promise<boolean>{
        // Define the column to update based on isFirstUser
        const scoreColumn = isFirstUser ? "firstUserScore" : "secondUserScore";

        const query = `
            UPDATE public."Game"
            SET "${scoreColumn}" = "${scoreColumn}" + 1
            WHERE id = '${gameId}'
        `;
        const result = await this.dataSource.query(query);
        return result[1] === 1;
    }

    async firstUserFinishesGame(gameId: string, isFirstUser: boolean, userId: string, answerStatus: string): Promise<boolean>{
        // Define the column to update based on isFirstUser
        const scoreColumn = isFirstUser ? "firstUserScore" : "secondUserScore";
        const correctAnswer = answerStatus === "Correct" ? true : false;

        const query = `
            UPDATE public."Game"
            SET "firstFinishedUserId" = '${userId}'
            ${correctAnswer ? `, "${scoreColumn}" = "${scoreColumn}" + 1` : ''}
            WHERE id = '${gameId}'
        `;
        const result = await this.dataSource.query(query);
        return result[1] === 1;
    }

    async finishGame(game: GameType): Promise<boolean>{
        const { id, status, finishGameDate, winnerId, loserId, firstUserScore, secondUserScore } = game;

        let query = `
            UPDATE public."Game"
            SET "status" = $1, "finishGameDate" = $2, "firstUserScore" = $3, "secondUserScore" = $4
        `;

        const values = [status, finishGameDate, firstUserScore, secondUserScore];

        let parameterIndex = values.length + 1; 

        if (winnerId) {
            query += `, "winnerId" = $${parameterIndex}`;
            values.push(winnerId);
            parameterIndex++;
        }

        if (loserId) {
            query += `, "loserId" = $${parameterIndex}`;
            values.push(loserId);
            parameterIndex++;
        }

        query += ` WHERE id = $${parameterIndex}`;
        values.push(id);
        const result = await this.dataSource.query(query, values);
        return result[1] === 1;
    }

    async addAnswer(answer: AnswerType): Promise<Result>{
        const { id, gameId, playerId, questionId, answerStatus, addedAt, sequence } = answer;
        const query = 
            `INSERT INTO public."Answer"(
	        id, "gameId", "playerId", "questionId", "answerStatus", "addedAt", sequence)
	        VALUES ('${id}','${gameId}','${playerId}','${questionId}','${answerStatus}','${addedAt}','${sequence}')
            RETURNING "questionId", "answerStatus", "addedAt";
        `;
        const result = await this.dataSource.query(query);
        if(result[0]){
            return {code: ResultCode.Success, data: result[0]}
        }else{
            return{code: ResultCode.Failed}
        }
    }

    async deleteWaitingUser(){
        const query =  `DELETE FROM public."User_waiting_for_game"`;
        const result = await this.dataSource.query(query);
        return result[1] === 1;
    }


    _mapCreatedGameToOutputType(game: GameType, login: string): GameOutputModel {
        return {
            id: game.id,
            firstPlayerProgress: {
                answers: [],
                player: {
                    id: game.firstUserId,
                    login: login,
                },
                score: 0
            },
            secondPlayerProgress: null,
            questions: null,
            status: game.status,
            pairCreatedDate: game.pairCreatedDate,
            startGameDate: null,
            finishGameDate: null
        }
    }
}
