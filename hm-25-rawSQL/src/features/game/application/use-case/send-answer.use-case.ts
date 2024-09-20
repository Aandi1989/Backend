import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { GamesQueryRepository } from "../../repo/games.query.repository";
import { UserOutputModel } from "../../../users/api/models/output/user.output.model";
import { v4 as uuidv4 } from 'uuid';
import { AnswerType, GameType } from "../../types/types";
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
        const addedAnswer = await this.createNewAnswer(activeGame.id, answerStatus, userId, questionId, amountOfAnswers);

        // update game
        const updatedGame = await this.updateGameData(amountOfAnswers, answerStatus, userId, activeGame);

        return addedAnswer;
    }

    private async createNewAnswer(gameId: string, answerStatus: string, playerId: string, 
        questionId: string, sequence: number): Promise<Result>{
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

    private async updateGameData(amountOfAnswers: number, answerStatus: string, userId: string, game: GameType): Promise<Result> {
        const isFirstUser = userId == game.firstUserId ? true : false;
        
        // user havent finish game yet
        if(amountOfAnswers <= 4){
            if(answerStatus == "Incorrect"){ 
                 return { code : ResultCode.Success }
            }else{
                const updatedGame = await this.gamesRepository.updateGameScore(game.id, isFirstUser);
                if (updatedGame)   return { code : ResultCode.Success }
            }
        }
        
        // user answers last question
        if(!game.firstFinishedUserId){
            const updatedGame = await this.gamesRepository.firstUserFinishesGame(game.id, isFirstUser, userId, answerStatus);
            if(updatedGame)  return { code : ResultCode.Success }
        }

        // user answers last question and finishes the game
        if(game.firstFinishedUserId){
            const finishedGameBody = this.formFinishedGameBody(answerStatus, userId, game);
            const updatedGame = await this.gamesRepository.finishGame(finishedGameBody);
            if(updatedGame)  return { code : ResultCode.Success }
        }

        return { code: ResultCode.Failed };
    }

    private formFinishedGameBody(answerStatus: string, userId: string, game: GameType): GameType{
        let { firstUserId, secondUserId, winnerId, loserId, firstUserScore, secondUserScore } = game;
        const isFirstUser = userId == game.firstUserId ? true : false;
        const finishGameDate = new Date().toISOString();

        if(isFirstUser){
            answerStatus === "Correct" ? ++firstUserScore : null;
            secondUserScore !== 0 ? ++secondUserScore : null;
        }else{
            answerStatus === "Correct" ? ++secondUserScore : null;
            firstUserScore !== 0 ? ++firstUserScore : null;
        }

        if(firstUserScore > secondUserScore){
            winnerId = firstUserId;
            loserId = secondUserId;
        }else if(secondUserScore > firstUserScore){
            winnerId = secondUserId;
            loserId = firstUserId;
        }

        const finishedGameBody: GameType = {
            id: game.id,
            firstUserId,
            secondUserId,
            status: "Finished",
            pairCreatedDate: game.pairCreatedDate,
            startGameDate: game.startGameDate,
            finishGameDate,
            winnerId,
            loserId,
            firstUserScore,
            secondUserScore,
            firstFinishedUserId: game.firstFinishedUserId
        }

        return finishedGameBody;
    }
}