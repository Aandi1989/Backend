import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Answer, Game, UserWaitingForGame } from "../domain/game.entity";

@Injectable()
export class GamesQueryRepository {
    constructor(@InjectRepository(Game) private readonly gamesRepository: Repository<Game>,
                @InjectRepository(Answer) private readonly answersRepository: Repository<Answer>,
                @InjectRepository(UserWaitingForGame) private readonly userWaitingRepository: Repository<UserWaitingForGame>){}
   
    async getWaitingUser(): Promise<UserWaitingForGame | null>{
        const response = await this.userWaitingRepository
            .createQueryBuilder("user")
            .getOne();

        return response;
    }
    async findActivePair(userId: string): Promise<Game | null>{
        const foundedGame = await this.gamesRepository
            .createQueryBuilder("game")
            .where("game.firstUserId = :userId OR game.secondUserId = :userId", {userId})
            .andWhere("game.status = :activeStatus OR game.status = :pendingStatus", {
                activeStatus: 'Active',
                pendingStatus: 'PendingForSecondUser'
            })
            .getOne();
        return foundedGame
    }
}