import { Module } from "@nestjs/common";
import { CqrsModule } from '@nestjs/cqrs';
import { UsersQueryRepo } from "./repo/users.query.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersController } from "./api/users.controller";
import { CreateUserUseCase } from "./application/use-cases/create-user.use-case";
import { DeleteUserUseCase } from "./application/use-cases/delete-user.use-case";
import { UsersRepository } from "./repo/users.repository";
import { JwtService } from "../../common/services/jwt-service";
import { SessionsModule } from "../security/session.module";
import { SaveUserTelegramIdUseCase } from "./application/use-cases/save-telegram-id.use-case";
import { SaveTelegramCodeUseCase } from "./application/use-cases/save-telegram-code.use-case";

@Module({
    imports:[ TypeOrmModule.forFeature(), SessionsModule, CqrsModule],
    providers:[UsersQueryRepo, UsersRepository, CreateUserUseCase, DeleteUserUseCase,
        SaveUserTelegramIdUseCase, SaveTelegramCodeUseCase ,JwtService],
    controllers:[UsersController],
    exports: [UsersQueryRepo, UsersRepository, TypeOrmModule.forFeature()]
})
export class UsersModule {}