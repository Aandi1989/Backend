import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GamesRepository } from "./repo/games.repository";
import { GamesQueryRepository } from "./repo/games.query.repository";
import { ConnectGameUseCase } from "./application/use-case/connect-game.use-case";
import { GamesController } from "./api/game.controller";
import { UsersQueryRepo } from "../users/repo/users.query.repository";
import { JwtService } from "../../common/services/jwt-service";
import { GetCurrentGameUseCase } from "./application/use-case/get-current-game.use-case";
import { QuestionsModule } from "../question/question.module";
import { SendAnswerUseCase } from "./application/use-case/send-answer.use-case";
import { QuestionsQueryRepo } from "../question/repo/questions.query.repository";
import { UsersModule } from "../users/user.module";
import { GetUserGameUseCase } from "./application/use-case/get-user-game.use-case";
import { GetMyGamesUseCase } from "./application/use-case/get-my-games.use-case";
import { GetMyStatisticUseCase } from "./application/use-case/get-my-statistic.use-case";

@Module({
    imports:[TypeOrmModule.forFeature(), CqrsModule, QuestionsModule, UsersModule],
    providers:[GamesRepository, GamesQueryRepository, ConnectGameUseCase, UsersQueryRepo, 
        GetCurrentGameUseCase, SendAnswerUseCase, QuestionsQueryRepo, GetUserGameUseCase, 
        GetMyGamesUseCase, GetMyStatisticUseCase, JwtService
    ],
    controllers:[GamesController],
    exports:[GamesRepository]
})
export class GameModule{}