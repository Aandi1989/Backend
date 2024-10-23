import { Module } from "@nestjs/common";
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtService } from "../../common/services/jwt-service";
import { TelegramController } from "./api/telegram.controller";
import { UsersModule } from "../users/user.module";
import { UsersQueryRepo } from "../users/repo/users.query.repository";
import { TelegramService } from "../../common/services/telegram-service";
import { HandleTelegramUpdatesUseCase } from "./application/use-cases/handle-telegram-updates.use-cases";

@Module({
    imports:[ TypeOrmModule.forFeature(), CqrsModule, UsersModule],
    providers:[ UsersQueryRepo, JwtService, TelegramService, HandleTelegramUpdatesUseCase],
    controllers:[TelegramController],
    exports: []
})
export class TelegramModule {}