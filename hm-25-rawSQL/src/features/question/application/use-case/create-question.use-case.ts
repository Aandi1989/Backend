import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateQuestionDto } from "../../api/modules/input/create-question.dto";
import { QuestionsRepository } from "../../repo/questions.repository";
import {v4 as uuidv4} from 'uuid';
import { QuestionType } from "../../types/types";

export class CreateQuestionCommand {
    constructor(public data: CreateQuestionDto){}
}

@CommandHandler(CreateQuestionCommand)
export class CreateQuestionUseCase implements ICommandHandler<CreateQuestionCommand>{
    constructor(protected questionsRepository: QuestionsRepository){}

    async execute(command: CreateQuestionCommand): Promise<QuestionType> {
        const newQuestion = {
            id: uuidv4(),
            body: command.data.body,
            correctAnswers: command.data.correctAnswers,
            published: false,
            createdAt: new Date().toISOString()
        };
        const createdQuestion = await this.questionsRepository.createQuestion(newQuestion);

        return createdQuestion;
    }
}