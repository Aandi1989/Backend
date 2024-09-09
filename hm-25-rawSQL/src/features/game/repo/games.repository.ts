import { Injectable } from "@nestjs/common";
import { GameType, UserWaitingForGame } from "../types/types";
import { GameOutputModel } from "../api/modules/output/game.output.model";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

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
    async deleteAllData() {
        const queryGames = `DELETE FROM public."Game"`;
        const gamesDelete = this.dataSource.query(queryGames);

        const queryAnswer = `DELETE FROM public."Answer"`;
        const answersDelete = this.dataSource.query(queryAnswer);

        const queryWaitingUser = `DELETE FROM public."User_waiting_for_game"`;
        const waitingUserDelete = this.dataSource.query(queryWaitingUser);

        await Promise.all([gamesDelete, answersDelete, waitingUserDelete])
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
