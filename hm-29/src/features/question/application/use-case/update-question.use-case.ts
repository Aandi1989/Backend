import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateQuestionDto } from "../../api/modules/input/create-question.dto";
import { QuestionsRepository } from "../../repo/questions.repository";

export class UpdateQuestionCommand {
    constructor(public id: string,
                public data: CreateQuestionDto){}
}

@CommandHandler(UpdateQuestionCommand)
export class UpdateQuestionUseCase implements ICommandHandler<UpdateQuestionCommand>{
    constructor(protected questionsRepository: QuestionsRepository) { }
  
    async execute(command: UpdateQuestionCommand): Promise<boolean> {
        const dataForUpdate = {
            body: command.data.body,
            correctAnswers: command.data.correctAnswers,
            updatedAt: new Date().toISOString(),
        }
        return await this.questionsRepository.updateQuestion(command.id, dataForUpdate)
    }
  }