import { TypeOrmModule } from "@nestjs/typeorm";
import { CqrsModule } from '@nestjs/cqrs';
import { QuestionsSAController } from "./api/question.sa.controller";
import { CreateQuestionUseCase } from "./application/use-case/create-question.use-case";
import { QuestionsRepository } from "./repo/questions.repository";
import { Module } from "@nestjs/common";
import { JwtService } from "../../common/services/jwt-service";
import { DeleteQuestionUseCase } from "./application/use-case/delete-question.use-case";
import { UpdateQuestionUseCase } from "./application/use-case/update-question.use-case";
import { PublishQuestionUseCase } from "./application/use-case/publish-question.use-case";
import { QuestionsQueryRepo } from "./repo/questions.query.repository";

@Module({
    imports:[TypeOrmModule.forFeature(), CqrsModule],
    providers:[QuestionsRepository, QuestionsQueryRepo, CreateQuestionUseCase, DeleteQuestionUseCase, UpdateQuestionUseCase,
        PublishQuestionUseCase , JwtService],
    controllers: [QuestionsSAController],
    exports: [QuestionsRepository, QuestionsQueryRepo]
})
export class QuestionsModule{}