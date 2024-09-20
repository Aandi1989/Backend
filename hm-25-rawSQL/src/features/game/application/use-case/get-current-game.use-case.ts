import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { GamesQueryRepository } from "../../repo/games.query.repository";
import { UserOutputModel } from "../../../users/api/models/output/user.output.model";
import { GameType } from "../../types/types";
import { Result, ResultCode } from "../../../../common/types/types";
import { GamesRepository } from "../../repo/games.repository";
import { QuestionsQueryRepo } from "../../../question/repo/questions.query.repository";
import { UsersQueryRepo } from "../../../users/repo/users.query.repository";

export class GetCurrentGameCommand {
    constructor(public user: UserOutputModel) { }
}

@CommandHandler(GetCurrentGameCommand)
export class GetCurrentGameUseCase implements ICommandHandler<GetCurrentGameCommand> {
    constructor(protected gamesQueryRepository: GamesQueryRepository,
                protected gamesRepository: GamesRepository,
                protected questionsQueryRepo: QuestionsQueryRepo,
                protected usersQueryRepo: UsersQueryRepo) { }

    async execute(command: GetCurrentGameCommand): Promise<Result> {
        const currentGame: GameType = await this.gamesQueryRepository.getCurrentUserGame(command.user.id);

        if(!currentGame) return {code: ResultCode.NotFound};

        if (currentGame.status == "PendingSecondPlayer"){
            const game = this.gamesRepository._mapPendingGameToOutputType(currentGame, command.user.login);
            return {code: ResultCode.Success, data: game};
        };
        
        if(currentGame.status == "Active"){
            const isFirstUser = command.user.id == currentGame.firstUserId ? true : false;
            let firstUserLogin, secondUserLogin;
            if(isFirstUser){
                firstUserLogin = command.user.login;
                 let secondUser = await this.usersQueryRepo.getUserById(currentGame.secondUserId!);
                 secondUserLogin = secondUser?.login;
            }else{
                secondUserLogin = command.user.login;
                let firstUser = await this.usersQueryRepo.getUserById(currentGame.firstUserId!);
                firstUserLogin = firstUser?.login;
            }

            const questions = await this.questionsQueryRepo.getQuestionsOfGame(currentGame.id);
            const firstUserAnswers = await this.gamesQueryRepository.getGameAnswersOfUser(currentGame.firstUserId, currentGame.id);
            const secondUserAnswers = await this.gamesQueryRepository.getGameAnswersOfUser(currentGame.secondUserId!, currentGame.id);
            const game = this.gamesRepository._mapGameToOutputType(currentGame, firstUserLogin, secondUserLogin, questions,
                firstUserAnswers, secondUserAnswers);
            return {code: ResultCode.Success, data: game}
        };

        return {code: ResultCode.Failed};
    }
}