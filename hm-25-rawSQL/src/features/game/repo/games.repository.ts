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
        const { id, firstUserId, status, pairCreatedDate, firstUserScore, secondUserScore, amountOfFinishedGame } = newGame;
        
        const query =
            `INSERT INTO public."Game" 
            (id, "firstUserId", status, "pairCreatedDate", "firstUserScore", "secondUserScore", "amountOfFinishedGame")
            VALUES ('${id}', '${firstUserId}', '${status}', '${pairCreatedDate}',  
             '${firstUserScore}', '${secondUserScore}', '${amountOfFinishedGame}')
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

    async addAnswer(answer: AnswerType): Promise<Result>{
        const { id, gameId, playerId, questionId, answerStatus, addedAt, sequence } = answer;
        const query = 
            `INSERT INTO public."Answer"(
	        id, "gameId", "playerId", "questionId", "answerStatus", "addedAt", sequence)
	        VALUES ('${id}','${gameId}','${playerId}','${questionId}','${answerStatus}','${addedAt}','${sequence}')
            RETURNING "questionId", "answerStatus", "addedAt";
        `;
        console.log('query of addAnswer', query);
        const result = await this.dataSource.query(query);
        console.log("addAnswer result-->", result);
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
