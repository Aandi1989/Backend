import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { GamesQueryRepository } from "../../repo/games.query.repository";
import { UserOutputModel } from "../../../users/api/models/output/user.output.model";
import { v4 as uuidv4 } from 'uuid';
import { GamesRepository } from "../../repo/games.repository";
import { GameType } from "../../types/types";
import { Result, ResultCode } from "../../../../common/types/types";
import { QuestionsRepository } from "../../../question/repo/questions.repository";
import { UsersQueryRepo } from "../../../users/repo/users.query.repository";
import { QuestionsQueryRepo } from "../../../question/repo/questions.query.repository";

export class ConnectGameCommand {
    constructor(public user: UserOutputModel) { }
}

@CommandHandler(ConnectGameCommand)
export class ConnectGameUseCase implements ICommandHandler<ConnectGameCommand> {
    constructor(protected gamesQueryRepository: GamesQueryRepository,
                protected gamesRepository: GamesRepository,
                protected questionsRepository: QuestionsRepository,
                protected usersQueryRepo: UsersQueryRepo,
                protected questionsQueryRepo: QuestionsQueryRepo) { }

    async execute(command: ConnectGameCommand): Promise<Result> {
        try {
            const userId = command.user.id;
            const userWaiting = await this.gamesQueryRepository.getWaitingUser();
            const pendingGame = await this.gamesQueryRepository.findPendingGame();
            const activeGame = await this.gamesQueryRepository.findActiveGame(userId);

            const userHasActiveGame = activeGame?.firstUserId == userId || activeGame?.secondUserId == userId;
            const userHasPendingGame = pendingGame?.firstUserId == userId || pendingGame?.secondUserId == userId;

            if (userHasActiveGame || userHasPendingGame) return { code: ResultCode.Forbidden };

            // if someone waiting for game
            if (userWaiting) {
                return this.activateExistingGame(command.user, pendingGame!.id)
            } else {
                // if nobody waiting for game 
                return this.createNewGame(command)
            }
        } catch (error) {
            console.log('Error connecting game:', error);
            return { code: ResultCode.Failed };
        }
    }

    private async activateExistingGame(user: UserOutputModel, gameId: string) {
        const deletedUser = await this.gamesRepository.deleteWaitingUser();
        const startDateGame = new Date().toISOString();
        const activatedGame = await this.gamesRepository.activateGame(user, gameId, startDateGame);
        const addedQuestions = await this.questionsRepository.generateGameQuestions(gameId);
        const questions = await this.questionsQueryRepo.getQuestionsOfGame(activatedGame.data.id);
        const firstUser = await this.usersQueryRepo.getUserById(activatedGame.data.firstUserId);
        const outputGameModel = this.gamesRepository._mapGameToOutputType(activatedGame.data, firstUser!.login, user.login, 
            questions , [], []
        )
        return { code: ResultCode.Success, data: outputGameModel };
    }

    private async createNewGame(command) {
        const firstUserForGame = this.userToCreateGame(command.user.id);
        const userAdding = await this.gamesRepository.addUser(firstUserForGame);
        const gameCreating = await this.createGameEntity(command.user.id, command.user.login);

        const results = await Promise.all([userAdding, gameCreating]);
        return { code: ResultCode.Success, data: results[1] };
    }

    private userToCreateGame(userId: string) {
        return {
            id: uuidv4(),
            userId: userId,
        }
    }

    private async createGameEntity(userId: string, login: string): Promise<any> {
        const newGame: GameType = {
            id: uuidv4(),
            firstUserId: userId,
            secondUserId: undefined,
            status: "PendingSecondPlayer",
            pairCreatedDate: new Date().toISOString(),
            startGameDate: undefined,
            finishGameDate: undefined,
            winnerId: undefined,
            loserId: undefined,
            firstUserScore: 0,
            secondUserScore: 0,
            firstFinishedUserId: undefined
        }
        return await this.gamesRepository.createGame(newGame, login)
    }
}