import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { GamesQueryRepository } from "../../repo/games.query.repository";
import { UserOutputModel } from "../../../users/api/models/output/user.output.model";
import { v4 as uuidv4 } from 'uuid';
import { AnswerType } from "../../types/types";
import { Result, ResultCode } from "../../../../common/types/types";
import { GamesRepository } from "../../repo/games.repository";
import { CreateAnswerDto } from "../../api/modules/input/create-answer.dto";
import { QuestionsQueryRepo } from "../../../question/repo/questions.query.repository";

export class SendAnswerCommand {
    constructor(public user: UserOutputModel,
                public body: CreateAnswerDto) { }
}

@CommandHandler(SendAnswerCommand)
export class SendAnswerUseCase implements ICommandHandler<SendAnswerCommand> {
    constructor(protected gamesQueryRepository: GamesQueryRepository,
                protected gamesRepository: GamesRepository,
                protected questionsQueryRepo: QuestionsQueryRepo) { }

    async execute(command: SendAnswerCommand): Promise<Result> {
        const userId = command.user.id;

        const activeGame = await this.gamesQueryRepository.findActiveGame(userId);
        const userHasActiveGame = activeGame?.firstUserId == userId || activeGame?.secondUserId == userId;
        if (!activeGame || !userHasActiveGame) return { code: ResultCode.Forbidden };

        let amountOfAnswers = await this.gamesQueryRepository.getAmountOfAnswer(userId, activeGame.id);
        if(amountOfAnswers && amountOfAnswers >= 5) return { code: ResultCode.Forbidden };

        // find out if the answer is correct
        const questionInfo = await this.questionsQueryRepo.getCorrectAnswer(activeGame.id, ++amountOfAnswers);
        const { correctAnswers, questionId } = questionInfo;
        const answerStatus = correctAnswers.includes(command.body.answer) ? "Correct" : "Incorrect";

        // insert the answer with status in the db
        const result = await this.createNewAnswer(activeGame.id, answerStatus, userId, questionId, amountOfAnswers);
        return result;
    }

    private async createNewAnswer(gameId: string, answerStatus: string, playerId: string, questionId: string, sequence: number):Promise<any>{
        const newAnswer: AnswerType = {
            id: uuidv4(),
            gameId,
            answerStatus,
            playerId,
            questionId,
            sequence,
            addedAt: new Date().toISOString()
        }
        return await this.gamesRepository.addAnswer(newAnswer);
    }
}