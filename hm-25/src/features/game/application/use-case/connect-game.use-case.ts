import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { GamesQueryRepository } from "../../repo/games.query.repository";
import { UserOutputModel } from "../../../users/api/models/output/user.output.model";
import {v4 as uuidv4} from 'uuid';
import { GamesRepository } from "../../repo/games.repository";

export class ConnectGameCommand {
    constructor(public user: UserOutputModel){}
}

@CommandHandler(ConnectGameCommand)
export class ConnectGameUseCase implements ICommandHandler<ConnectGameCommand>{
    constructor(protected gamesQueryRepository: GamesQueryRepository,
                protected gamesRepository: GamesRepository
    ){}

    //                                              any must be replaced
    async execute (command: ConnectGameCommand): Promise<any>{
        const userWaiting = await this.gamesQueryRepository.getWaitingUser();
        // if nobody waiting for game
        if(!userWaiting){
            const userForGame = {
                id: uuidv4(),
                userId: command.user.id
            }
            await this.gamesRepository.addUser(userForGame);

            const newGame = {
                id: uuidv4(),
                firstUserId: command.user.id,
                secondUserId: null,
                status: "PendingSecondPlayer",
                pairCreatedDate: new Date().toISOString(),
                startGameDate: null,
                finishGameDate: null,
                winnerId: null,
                loserId: null,
                firstUserScore: 0,
                secondUserScore: 0,
                amountOfFinishedGame: 0
            }
        }
        return userWaiting;
    }
}