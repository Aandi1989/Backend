import { TypeOrmModule } from "@nestjs/typeorm";
import { CqrsModule } from '@nestjs/cqrs';
import { QuestionsSAController } from "./api/question.sa.controller";
import { CreateQuestionUseCase } from "./application/use-case/create-question.use-case";
import { GameQuestion, Question } from "./domain/question.entity";
import { QuestionsRepository } from "./repo/questions.repository";
import { Module } from "@nestjs/common";
import { Answer, Game } from "../game/domain/game.entity";
import { JwtService } from "../../common/services/jwt-service";
import { DeleteQuestionUseCase } from "./application/use-case/delete-question.use-case";
import { UpdateQuestionUseCase } from "./application/use-case/update-question.use-case";
import { PublishQuestionUseCase } from "./application/use-case/publish-question.use-case";
import { QuestionsQueryRepo } from "./repo/questions.query.repository";

@Module({
    // Game, Answer must be replaced to the GameModule afterward
    imports:[TypeOrmModule.forFeature([Question, GameQuestion, Game, Answer]), CqrsModule],
    providers:[QuestionsRepository, QuestionsQueryRepo, CreateQuestionUseCase, DeleteQuestionUseCase, UpdateQuestionUseCase,
        PublishQuestionUseCase , JwtService],
    controllers: [QuestionsSAController],
    exports: []
})
export class QuestionsModule{}