import { TypeOrmModule } from "@nestjs/typeorm";
import { CqrsModule } from '@nestjs/cqrs';
import { QuestionsSAController } from "./api/question.sa.controller";
import { CreateQuestionUseCase } from "./application/use-case/create-question.use-case";
import { GameQuestion, Question } from "./domain/question.entity";
import { QuestionsRepository } from "./repo/questions.repository";
import { Module } from "@nestjs/common";
import { JwtService } from "../../common/services/jwt-service";
import { DeleteQuestionUseCase } from "./application/use-case/delete-question.use-case";
import { UpdateQuestionUseCase } from "./application/use-case/update-question.use-case";
import { PublishQuestionUseCase } from "./application/use-case/publish-question.use-case";
import { QuestionsQueryRepo } from "./repo/questions.query.repository";
import { RedisService } from "../redis/application/redis.service";

@Module({
    imports:[TypeOrmModule.forFeature([Question, GameQuestion]), CqrsModule],
    providers:[QuestionsRepository, QuestionsQueryRepo, CreateQuestionUseCase, DeleteQuestionUseCase, UpdateQuestionUseCase,
        PublishQuestionUseCase , JwtService, RedisService],
    controllers: [QuestionsSAController],
    exports: [QuestionsRepository]
})
export class QuestionsModule{}