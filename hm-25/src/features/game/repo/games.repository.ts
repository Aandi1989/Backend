import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Answer, Game, UserWaitingForGame } from "../domain/game.entity";
import { UserOutputModel } from "../../users/api/models/output/user.output.model";

@Injectable()
export class GamesRepository {
    constructor(@InjectRepository(Game) private readonly gamesRepository: Repository<Game>,
                @InjectRepository(Answer) private readonly answersRepository: Repository<Answer>,
                @InjectRepository(UserWaitingForGame) private readonly userWaitingRepository: Repository<UserWaitingForGame>){}
    
    async addUser(user: UserWaitingForGame){
        const result = await this.userWaitingRepository.save(user);
        return result;
    }
    async createGame(newGame: Game){

    }
    async deleteAllData(){
        const gameResult = await this.gamesRepository
        .createQueryBuilder()
        .delete()
        .execute()
        const answerresult = await this.answersRepository
        .createQueryBuilder()
        .delete()
        .execute()
    }
}