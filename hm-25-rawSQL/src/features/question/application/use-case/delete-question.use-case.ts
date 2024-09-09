import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { QuestionsRepository } from "../../repo/questions.repository";

export class DeleteQuestionCommand {
    constructor(public id: string){}
}

@CommandHandler(DeleteQuestionCommand)
export class DeleteQuestionUseCase implements ICommandHandler<DeleteQuestionCommand>{
    constructor(protected questionsRepository: QuestionsRepository){}

    async execute(command: DeleteQuestionCommand): Promise<boolean> {
        return await this.questionsRepository.deleteQuestion(command.id)
    }
}