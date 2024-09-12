import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { GamesQueryRepository } from "../../repo/games.query.repository";
import { UserOutputModel } from "../../../users/api/models/output/user.output.model";
import { v4 as uuidv4 } from 'uuid';
import { GameType } from "../../types/types";
import { Result, ResultCode } from "../../../../common/types/types";
import { GamesRepository } from "../../repo/games.repository";

export class GetCurrentGameCommand {
    constructor(public user: UserOutputModel) { }
}

@CommandHandler(GetCurrentGameCommand)
export class GetCurrentGameUseCase implements ICommandHandler<GetCurrentGameCommand> {
    constructor(protected gamesQueryRepository: GamesQueryRepository,
                protected gamesRepository: GamesRepository) { }

    async execute(command: GetCurrentGameCommand): Promise<Result> {
        // const currentGame = await this.gamesQueryRepository.findActivePair(command.user.id);
        // if(!currentGame) return {code: ResultCode.NotFound};
        
        // if(currentGame.status == "PendingSecondPlayer") {
        //     const game = this.gamesRepository._mapCreatedGameToOutputType(currentGame, command.user.login);
        //     return {code: ResultCode.Success, data: game};
        // }

        return {code: ResultCode.NotFound};


    
    }
}