import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { GamesQueryRepository } from "../../repo/games.query.repository";
import { UserOutputModel } from "../../../users/api/models/output/user.output.model";
import { v4 as uuidv4 } from 'uuid';
import { GamesRepository } from "../../repo/games.repository";
import { Game } from "../../domain/game.entity";
import { GameType } from "../../types/types";
import { ForbiddenException } from "@nestjs/common";
import { Result, ResultCode } from "../../../../common/types/types";

export class ConnectGameCommand {
    constructor(public user: UserOutputModel) { }
}

@CommandHandler(ConnectGameCommand)
export class ConnectGameUseCase implements ICommandHandler<ConnectGameCommand> {
    constructor(protected gamesQueryRepository: GamesQueryRepository,
        protected gamesRepository: GamesRepository
    ) { }

    //                                              any must be replaced
    async execute(command: ConnectGameCommand): Promise<Result> {
        const activePair = await this.gamesQueryRepository.findActivePair(command.user.id);
        const userWaiting = await this.gamesQueryRepository.getWaitingUser();

        if(activePair) return {code: ResultCode.Forbidden};
        
        // if nobody waiting for game
        if (!userWaiting) {
          const firstUserForGame = this.userToCreateGame(command.user.id);
          const userAdding = this.gamesRepository.addUser(firstUserForGame);
          const gameCreating = this.createGame(command.user.id, command.user.login);

          const results = await Promise.all([userAdding, gameCreating]);
          return {code: ResultCode.Success, data: results[1]};
        }
        return {code: ResultCode.Failed};
    }

    private userToCreateGame(userId: string) {
        return {
            id: uuidv4(),
            userId: userId,
        }
    }

    private async createGame(userId: string, login: string): Promise<any> {
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
            amountOfFinishedGame: 0
        }
        return await this.gamesRepository.createGame(newGame, login)
    }
}