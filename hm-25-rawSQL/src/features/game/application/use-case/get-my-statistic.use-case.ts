import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { GamesQueryRepository } from "../../repo/games.query.repository";
import { UserOutputModel } from "../../../users/api/models/output/user.output.model";
import { GameType, InitialStatistic } from "../../types/types";
import { Result, ResultCode } from "../../../../common/types/types";
import { MyStatisticModel } from "../../api/modules/output/game.output.model";


export class GetMyStatisticCommand {
    constructor(public user: UserOutputModel) { }
}

@CommandHandler(GetMyStatisticCommand)
export class GetMyStatisticUseCase implements ICommandHandler<GetMyStatisticCommand> {
    constructor(protected gamesQueryRepository: GamesQueryRepository) { }

    async execute(command: GetMyStatisticCommand): Promise<Result> {
        const userId = command.user.id;
        const games: GameType[] = await this.gamesQueryRepository.getUserStatistic(userId);
        
        let initStatistic: InitialStatistic = {
            sumScore: 0,
            winsCount: 0,
            lossesCount: 0,
            unfinishedGames: 0,
        }

        games.forEach(game => {
            if(userId == game.firstUserId){
                initStatistic.sumScore += game.firstUserScore;
            }

            if(userId == game.secondUserId){
                initStatistic.sumScore += game.secondUserScore;
            }
            
            userId == game.winnerId ? initStatistic.winsCount++ : null;
            userId == game.loserId ? initStatistic.lossesCount++ : null;
            game.status !== "Finished" ? initStatistic.unfinishedGames++ : null;
        })

        let result: MyStatisticModel = {
            sumScore: initStatistic.sumScore,
            avgScores: +(initStatistic.sumScore / games.length).toFixed(2),
            gamesCount: games.length,
            winsCount: initStatistic.winsCount,
            lossesCount: initStatistic.lossesCount,
            drawsCount: games.length - initStatistic.winsCount - initStatistic.lossesCount - initStatistic.unfinishedGames
        }

        return {code: ResultCode.Success, data: result};
    }
}