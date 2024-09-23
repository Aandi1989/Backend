import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { GamesQueryRepository } from "../../repo/games.query.repository";
import { UserOutputModel } from "../../../users/api/models/output/user.output.model";
import { GameQueryOutputType, gamesAnswersDictionary, GameType, loginsDictionary, questionsDictionary } from "../../types/types";
import { Result, ResultCode } from "../../../../common/types/types";
import { GamesRepository } from "../../repo/games.repository";
import { QuestionsQueryRepo } from "../../../question/repo/questions.query.repository";
import { UsersQueryRepo } from "../../../users/repo/users.query.repository";
import { GameInitialOutputModel, GameOutputModel, GameSOutputModel } from "../../api/modules/output/game.output.model";

export class GetMyGamesCommand {
    constructor(public user: UserOutputModel,
                public query: GameQueryOutputType,
    ) { }
}

@CommandHandler(GetMyGamesCommand)
export class GetMyGamesUseCase implements ICommandHandler<GetMyGamesCommand> {
    constructor(protected gamesQueryRepository: GamesQueryRepository,
                protected gamesRepository: GamesRepository,
                protected questionsQueryRepo: QuestionsQueryRepo,
                protected usersQueryRepo: UsersQueryRepo) { }

    async execute(command: GetMyGamesCommand): Promise<Result> {
        const userId = command.user.id;
        const gameIds: string[] = [];
        const usersIds = new Set();
        let logins: loginsDictionary = {};
        let questions: questionsDictionary = {};
        let answers: gamesAnswersDictionary = {};

        // get sorted user's games in GameType
        let userGames: GameInitialOutputModel = await this.gamesQueryRepository.getUserGames(userId, command.query);
        
        const games = userGames.items;
        games.forEach(game =>{
            gameIds.push(game.id);
            usersIds.add(game.firstUserId);
            usersIds.add(game.secondUserId);
        });

        // get users' logins
        const loginsArr = await this.usersQueryRepo.getLoginsByIdArr(Array.from(usersIds) as string[]);
        logins = loginsArr.reduce((obj, user) => {
            obj[user.id] = user.login;
            return obj;
        }, {});

        // get games' questions
        const questionsArr = await this.questionsQueryRepo.getQuestionsByGameIds(gameIds);
        questions = questionsArr.reduce((acc, question) => {
            if (!acc[question.gameId]) {
                acc[question.gameId] = [];
            }
            acc[question.gameId].push({ id: question.id, body: question.body });
            return acc;
        }, {});

        // get answers for all games
        const answerArr = await this.gamesQueryRepository.getAnswersForUserGames(Array.from(usersIds) as string[], gameIds);
        answers = answerArr.reduce((acc, ans) => {
            if (!acc[ans.gameId]) {
                acc[ans.gameId] = {};
            }

            if (!acc[ans.gameId][ans.playerId]) {
                acc[ans.gameId][ans.playerId] = [];
            }

            acc[ans.gameId][ans.playerId].push({
                questionId: ans.questionId,
                answerStatus: ans.answerStatus,
                addedAt: ans.addedAt
            });
            return acc;
        },{});

        // form final array of games
        const gamesOutput: GameOutputModel[] = games.map((game: GameType) => ({
            id: game.id,
            firstPlayerProgress: {
                answers: answers[game.id][game.firstUserId] ?  answers[game.id][game.firstUserId] : [],
                player: {
                    id: game.firstUserId,
                    login: logins[game.firstUserId]
                },
                score: game.firstUserScore
            },
            secondPlayerProgress: game.secondUserId 
                ? { answers: answers[game.id][game.secondUserId!] ?  answers[game.id][game.secondUserId!] : [],
                    player: {
                        id: game.secondUserId,
                        login: logins[game.secondUserId]
                    },
                    score: game.secondUserScore
                }
                : null, 
            questions: questions[game.id] ? questions[game.id] : null,
            status: game.status,
            pairCreatedDate: game.pairCreatedDate,
            startGameDate: game.startGameDate ? game.startGameDate : null,
            finishGameDate: game.finishGameDate ? game.finishGameDate : null
        }))

        const result: GameSOutputModel = {
            pagesCount: userGames.pagesCount,
            page: userGames.page,
            pageSize: userGames.pageSize,
            totalCount: userGames.totalCount,
            items : gamesOutput
        }

        return {code: ResultCode.Success, data: result}
    }
}