import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { QuestionsRepository } from "../../repo/questions.repository";
import { PublishQuestionDto } from "../../api/modules/input/publish-question.dto";

export class PublishQuestionCommand {
    constructor(public id: string,
                public data: PublishQuestionDto){}
}

@CommandHandler(PublishQuestionCommand)
export class PublishQuestionUseCase implements ICommandHandler<PublishQuestionCommand>{
    constructor(protected questionsRepository: QuestionsRepository) { }
  
    async execute(command: PublishQuestionCommand): Promise<boolean> {
        return await this.questionsRepository.publishQuestion(command.id, command.data);
    }
  }