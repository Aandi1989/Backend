import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Answer, Game, UserWaitingForGame } from "../domain/game.entity";
import { GameType } from "../types/types";
import { GameOutputModel } from "../api/modules/output/game.output.model";

@Injectable()
export class GamesRepository {
    constructor(@InjectRepository(Game) private readonly gamesRepository: Repository<Game>,
                @InjectRepository(Answer) private readonly answersRepository: Repository<Answer>,
                @InjectRepository(UserWaitingForGame) private readonly userWaitingRepository: Repository<UserWaitingForGame>){}
    
    async addUser(user: UserWaitingForGame){
        const result = await this.userWaitingRepository.save(user);
        return result;
    }
    async createGame(newGame: GameType, login: string){
        const result = await this.gamesRepository.save(newGame);
        return this._mapCreatedGameToOutputType(result, login);
    }
    async deleteAllData(){
        const gamesDelete = this.gamesRepository
        .createQueryBuilder()
        .delete()
        .execute()
        const answersDelete = this.answersRepository
        .createQueryBuilder()
        .delete()
        .execute()
        
        await Promise.all([gamesDelete, answersDelete])
    }
    _mapCreatedGameToOutputType(game: GameType, login: string): GameOutputModel{
        return {
            id: game.id,
            firstPlayerProgress:{
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
