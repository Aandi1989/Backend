import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Answer, Game, UserWaitingForGame } from "./domain/game.entity";
import { GamesRepository } from "./repo/games.repository";
import { GamesQueryRepository } from "./repo/games.query.repository";
import { ConnectGameUseCase } from "./application/use-case/connect-game.use-case";
import { GamesController } from "./api/game.controller";
import { UsersQueryRepo } from "../users/repo/users.query.repository";
import { JwtService } from "../../common/services/jwt-service";
import { User } from "../users/domain/user.entity";

@Module({
    imports:[TypeOrmModule.forFeature([Game, Answer, UserWaitingForGame, User]), CqrsModule],
    providers:[GamesRepository, GamesQueryRepository, ConnectGameUseCase,
        UsersQueryRepo, JwtService
    ],
    controllers:[GamesController],
    exports:[GamesRepository]
})
export class GameModule{}