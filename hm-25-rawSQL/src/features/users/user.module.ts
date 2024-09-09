import { Module } from "@nestjs/common";
import { CqrsModule } from '@nestjs/cqrs';
import { UsersQueryRepo } from "./repo/users.query.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersController } from "./api/users.controller";
import { CreateUserUseCase } from "./application/use-cases/create-user.use-case";
import { DeleteUserUseCase } from "./application/use-cases/delete-user.use-case";
import { UsersRepository } from "./repo/users.repository";
import { JwtService } from "../../common/services/jwt-service";

@Module({
    imports:[ TypeOrmModule.forFeature(), CqrsModule],
    providers:[UsersQueryRepo, UsersRepository, CreateUserUseCase, DeleteUserUseCase, JwtService],
    controllers:[UsersController],
    exports: [UsersQueryRepo, UsersRepository, TypeOrmModule.forFeature()]
})
export class UsersModule {}