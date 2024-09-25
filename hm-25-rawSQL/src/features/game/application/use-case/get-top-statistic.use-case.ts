import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { GamesQueryRepository } from "../../repo/games.query.repository";
import { UserOutputModel } from "../../../users/api/models/output/user.output.model";
import { GameType, InitialStatistic, loginsDictionary, topUsersDictionary } from "../../types/types";
import { Result, ResultCode } from "../../../../common/types/types";
import { MyStatisticModel, StatisticWithPaginationModel } from "../../api/modules/output/game.output.model";
import { UsersQueryRepo } from "../../../users/repo/users.query.repository";
import { StatisticQueryDTO } from "../../api/modules/input/statistic-query.dto";
import { sortUserStatistics } from "../../../../common/helpers/sortUserStatistics";


export class GetTopStatisticCommand {
    constructor(public query: StatisticQueryDTO) { }
}

@CommandHandler(GetTopStatisticCommand)
export class GetTopStatisticUseCase implements ICommandHandler<GetTopStatisticCommand> {
    constructor(protected gamesQueryRepository: GamesQueryRepository,
                protected usersQueryRepo: UsersQueryRepo
    ) { }

    async execute(command: GetTopStatisticCommand): Promise<StatisticWithPaginationModel> {
        const { pageNumber, pageSize, sort } = command.query;
        const usersIds = new Set();
        let logins: loginsDictionary = {};
        let userStat: topUsersDictionary = {};

        // get all games
        const games: GameType[] = await this.gamesQueryRepository.getAllGames();

        games.forEach(game => {
            usersIds.add(game.firstUserId);
            usersIds.add(game.secondUserId);
        });

        usersIds.forEach((userId: string) => {
            userStat[userId] = {
                sumScore: 0,
                avgScores: 0,
                gamesCount: 0,
                winsCount: 0,
                lossesCount: 0,
                drawsCount: 0,
                unfinishedCount: 0,
                player: {
                    id: userId,
                    login: 'empty'
                }
            }
        })

        // get users' logins
        const loginsArr = await this.usersQueryRepo.getLoginsByIdArr(Array.from(usersIds) as string[]);
        logins = loginsArr.reduce((obj, user) => {
            obj[user.id] = user.login;
            return obj;
        }, {});

        // process data of each game and update users' statistic
        games.forEach((game: GameType) => {
            // sumScore
            userStat[game.firstUserId].sumScore = userStat[game.firstUserId].sumScore + game.firstUserScore;

            // gamesCount
            userStat[game.firstUserId].gamesCount++;

            // winsCount
            if(game.winnerId){
                userStat[game.winnerId].winsCount++
            };

            // lossesCount
            if(game.loserId){
                userStat[game.loserId].lossesCount++;
            };
            
            // the same for the second user
            if(game.secondUserId){
                userStat[game.secondUserId].sumScore =  userStat[game.secondUserId].sumScore + game.secondUserScore;
                userStat[game.secondUserId].gamesCount++;
            }

            // unfinishedCount
            if(game.status == "Active"){
                userStat[game.firstUserId].unfinishedCount!++;
                userStat[game.secondUserId!].unfinishedCount!++;
            }
            if(game.status == "PendingSecondPlayer"){
                userStat[game.firstUserId].unfinishedCount!++;
            }
        })

        Object.entries(userStat).forEach(([userId, stats]: [string, MyStatisticModel]) => {
            stats.avgScores = +(stats.sumScore / stats.gamesCount).toFixed(2);
            stats.drawsCount = stats.gamesCount - stats.winsCount - stats.lossesCount - stats.unfinishedCount!;
            stats.player!.login = logins[userId];
            delete stats.unfinishedCount;
        });

        const sortedUsers = sortUserStatistics(Object.values(userStat), sort);

        const pagesCount = Math.ceil(sortedUsers.length / pageSize!);
        const offset = (pageNumber! - 1) * pageSize!;
        const items = sortedUsers.slice(offset, offset + pageSize!);


        return {
            pagesCount: pagesCount,
            page: pageNumber!,
            pageSize: pageSize!,
            totalCount: sortedUsers.length,
            items: items
        };
    }
}