import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { GamesQueryRepository } from "../../repo/games.query.repository";
import { UserOutputModel } from "../../../users/api/models/output/user.output.model";
import { GameType } from "../../types/types";
import { Result, ResultCode } from "../../../../common/types/types";
import { GamesRepository } from "../../repo/games.repository";
import { QuestionsQueryRepo } from "../../../question/repo/questions.query.repository";
import { UsersQueryRepo } from "../../../users/repo/users.query.repository";

export class GetUserGameCommand {
    constructor(public user: UserOutputModel,
                public gameId: string) { }
}

@CommandHandler(GetUserGameCommand)
export class GetUserGameUseCase implements ICommandHandler<GetUserGameCommand> {
    constructor(protected gamesQueryRepository: GamesQueryRepository,
                protected gamesRepository: GamesRepository,
                protected questionsQueryRepo: QuestionsQueryRepo,
                protected usersQueryRepo: UsersQueryRepo) { }

    async execute(command: GetUserGameCommand): Promise<Result> {
        const userId = command.user.id;
        const foundGame: GameType = await this.gamesQueryRepository.getGameById(command.gameId);

        if(!foundGame) return {code: ResultCode.NotFound};

        if(foundGame.firstUserId != userId && foundGame.secondUserId != userId) return {code: ResultCode.Forbidden};

        if (foundGame.status == "PendingSecondPlayer"){
            const game = this.gamesRepository._mapPendingGameToOutputType(foundGame, command.user.login);
            return {code: ResultCode.Success, data: game};
        };
        
        if(foundGame.status != "PendingSecondPlayer"){
            const isFirstUser = command.user.id == foundGame.firstUserId ? true : false;
            let firstUserLogin, secondUserLogin;
            if(isFirstUser){
                firstUserLogin = command.user.login;
                 let secondUser = await this.usersQueryRepo.getUserById(foundGame.secondUserId!);
                 secondUserLogin = secondUser?.login;
            }else{
                secondUserLogin = command.user.login;
                let firstUser = await this.usersQueryRepo.getUserById(foundGame.secondUserId!);
                firstUserLogin = firstUser?.login;
            }

            const questions = await this.questionsQueryRepo.getQuestionsOfGame(foundGame.id);
            const firstUserAnswers = await this.gamesQueryRepository.getGameAnswersOfUser(foundGame.firstUserId, foundGame.id);
            const secondUserAnswers = await this.gamesQueryRepository.getGameAnswersOfUser(foundGame.secondUserId!, foundGame.id);
            const game = this.gamesRepository._mapGameToOutputType(foundGame, firstUserLogin, secondUserLogin, questions,
                firstUserAnswers, secondUserAnswers);
            return {code: ResultCode.Success, data: game}
        };

        return {code: ResultCode.Failed};
    }
}