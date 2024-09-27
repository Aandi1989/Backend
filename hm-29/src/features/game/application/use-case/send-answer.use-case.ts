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

        // create the date for addedAt field of answer
        const addedAnswerTime = new Date().toISOString();

        // create the date for auto completion of game 
        const date = new Date(addedAnswerTime);
        date.setSeconds(date.getSeconds() + 10);
        const dateOfAutoFinishGame = date.toISOString();

        // insert the answer with status in the db
        const addedAnswer = await this.createNewAnswer(activeGame.id, answerStatus, userId, questionId, amountOfAnswers, addedAnswerTime);

        // update game
        const updatedGame = await this.updateGameData(amountOfAnswers, answerStatus, userId, activeGame, dateOfAutoFinishGame);

        return addedAnswer;
    }

    private async createNewAnswer(gameId: string, answerStatus: string, playerId: string, 
        questionId: string, sequence: number, addedAt: string): Promise<Result>{
        const newAnswer: AnswerType = {
            id: uuidv4(),
            gameId,
            answerStatus,
            playerId,
            questionId,
            sequence,
            addedAt
        }
        return await this.gamesRepository.addAnswer(newAnswer);
    }

    private async createAutoAnswer(gameId: string, playerId: string, questionId: string, 
        sequence: number, addedAt: string):Promise<Result>{
            const newAnswer: AnswerType = {
                id: uuidv4(),
                gameId,
                answerStatus: "Incorrect",
                playerId,
                questionId,
                sequence,
                addedAt
            }
            return await this.gamesRepository.addAnswer(newAnswer);
    }

    private async updateGameData(amountOfAnswers: number, answerStatus: string, userId: string, game: GameType,
        dateOfAutoFinishGame: string): Promise<Result> {
        const isFirstUser = userId == game.firstUserId ? true : false;
        
        // user haven't finish game yet
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
            await this.firstUserFinishesGame(game, isFirstUser, userId, answerStatus, dateOfAutoFinishGame);
        }

        // user answers last question and finishes the game
        if(game.firstFinishedUserId){
            const finishedGameBody = this.formFinishedGameBody(answerStatus, userId, game);
            const updatedGame = await this.gamesRepository.finishGame(finishedGameBody);
            if(updatedGame)  return { code : ResultCode.Success }
        }

        return { code: ResultCode.Failed };
    }

    private async firstUserFinishesGame(game: GameType, isFirstUser: boolean, userId: string, answerStatus: string,
        dateOfAutoFinishGame: string ){
        const updatedGame = await this.gamesRepository.sendLastAnswerOfFirstUSer(game.id, isFirstUser, userId, answerStatus);
        process.nextTick(() => {
            this.autoFinishGame(game, isFirstUser, dateOfAutoFinishGame, userId); // Call the delay function that works after 10 seconds
        })

        if(updatedGame)  return { code : ResultCode.Success }
    }


    private async autoFinishGame(game: GameType, isFirstUser: boolean, dateOfAutoFinishGame: string, userId: string){
        await new Promise<void>(resolve => { 
            setTimeout(async () => {
            const lateUserId = isFirstUser ? game.secondUserId : game.firstUserId;

            let amountOfAnswers = await this.gamesQueryRepository.getAmountOfAnswer(lateUserId!, game.id);
            if(amountOfAnswers == 5){
                resolve();
                return;
            }
            
            // getting questions for game
            const questions = await this.questionsQueryRepo.getQuestionsOfGame(game.id);

            // adding auto answers with status "Incorrect"
            for(let i = amountOfAnswers, j = amountOfAnswers + 1; i < 6; i++, j++){
                if(questions[i]){
                    await this.createAutoAnswer(game.id, lateUserId!, questions[i].id, j, dateOfAutoFinishGame);
                }
            }

            // auto finish the game
            const gameToFinish = await this.gamesQueryRepository.findActiveGame(userId);
            const finishedGameBody = this.formFinishedGameBody("Incorrect", lateUserId!, gameToFinish!, dateOfAutoFinishGame);
            const finishedGame = await this.gamesRepository.finishGame(finishedGameBody);

            resolve();
        }, 10000)});
    }

    private formFinishedGameBody(answerStatus: string, userId: string, game: GameType, dateFinishGame?: string): GameType{
        let { firstUserId, secondUserId, winnerId, loserId, firstUserScore, secondUserScore } = game;
        const isFirstUser = userId == game.firstUserId ? true : false;
        const finishGameDate = new Date().toISOString();

        if(isFirstUser){
            answerStatus === "Correct" ? ++firstUserScore : null;
            // adding extra point if need
            secondUserScore !== 0 ? ++secondUserScore : null;
        }else{
            answerStatus === "Correct" ? ++secondUserScore : null;
            // adding extra point if need
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
            finishGameDate: dateFinishGame ? dateFinishGame : finishGameDate,
            winnerId,
            loserId,
            firstUserScore,
            secondUserScore,
            firstFinishedUserId: game.firstFinishedUserId
        }

        return finishedGameBody;
    }
}