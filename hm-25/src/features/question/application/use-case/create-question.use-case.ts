import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateQuestionDto } from "../../api/modules/input/create-question.dto";
import { QuestionsRepository } from "../../repo/questions.repository";
import {v4 as uuidv4} from 'uuid';
import { QuestionType } from "../../types/types";
import { RedisService } from "../../../redis/application/redis.service";

export class CreateQuestionCommand {
    constructor(public data: CreateQuestionDto){}
}

@CommandHandler(CreateQuestionCommand)
export class CreateQuestionUseCase implements ICommandHandler<CreateQuestionCommand>{
    constructor(protected questionsRepository: QuestionsRepository,
                private readonly redisService: RedisService
    ){}

    async execute(command: CreateQuestionCommand): Promise<QuestionType> {
        const newQuestion = {
            id: uuidv4(),
            body: command.data.body,
            correctAnswers: command.data.correctAnswers,
            published: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        const createdQuestion = await this.questionsRepository.createQuestion(newQuestion);

        // this code was written to check if Redis was connected and works
        /*
        const key = newQuestion.id;
        const client = this.redisService.getClient();
        await client.set(key, JSON.stringify(newQuestion));
        */

        return createdQuestion;
    }
}