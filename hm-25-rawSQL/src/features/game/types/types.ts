import { AnswerOutputModel, QuestionOutputModel } from "../api/modules/output/game.output.model"

export class UserWaitingForGame {
    id: string
    userId: string 
}

export class GameType {
    id: string
    firstUserId: string
    secondUserId?: string
    status: string
    pairCreatedDate: string
    startGameDate?: string
    finishGameDate?: string
    winnerId?: string
    loserId?: string
    firstUserScore: number
    secondUserScore: number
    firstFinishedUserId?: string
}

export class AnswerType {
    id: string
    gameId: string
    playerId: string
    questionId: string
    answerStatus: string
    addedAt: string
    sequence: number
}

export type GameQueryType = {
    sortBy: GameSortBy,
    sortDirection:sortDirectionType,
    pageNumber: string,
    pageSize: string
}

export type GameQueryOutputType = {
    sortBy: GameSortBy,
    sortDirection:sortDirectionType,
    pageNumber: number,
    pageSize: number
}

export type loginsDictionary = Record<string, string>

export type questionsDictionary = Record<string, QuestionOutputModel[]>

type userAnswersDictionary = Record<string, AnswerOutputModel[]>

export type gamesAnswersDictionary = Record<string, userAnswersDictionary>

export type InitialStatistic = {
    sumScore: number,
    winsCount: number,
    lossesCount: number,
    unfinishedGames: number,
}


type GameSortBy = "id" | "firstUserId" | "secondUserId" | "status" | "pairCreatedDate" | "startGameDate" | "finishGameDate";

type sortDirectionType = "asc" | "desc";
