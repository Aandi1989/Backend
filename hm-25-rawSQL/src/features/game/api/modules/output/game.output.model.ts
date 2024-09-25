import { GameType } from "../../../types/types"

export class GameSOutputModel {
  pagesCount: number
  page: number
  pageSize: number
  totalCount: number
  items : GameOutputModel[]
}

export class GameInitialOutputModel {
  pagesCount: number
  page: number
  pageSize: number
  totalCount: number
  items : GameType[]
}

export class GameOutputModel  {
    id: string
    firstPlayerProgress: {
        answers: AnswerOutputModel[]
        player: {
            id: string
            login: string
        }
        score: number
    }
    secondPlayerProgress: {
        answers: AnswerOutputModel[]
        player: {
            id: string
            login: string
        }
        score: number
    } | null
    questions: QuestionOutputModel[] | null
    status: string
    pairCreatedDate: string
    startGameDate: string | null
    finishGameDate: string | null
  };

  export class AnswerOutputModel {
    questionId: string
    answerStatus: string
    addedAt: string
  }

  export class QuestionOutputModel {
    id: string
    body: string
  }

  export class StatisticWithPaginationModel {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: MyStatisticModel[]
  }

  export class MyStatisticModel {
    sumScore: number
    avgScores: number
    gamesCount: number
    winsCount: number
    lossesCount: number
    drawsCount: number
    unfinishedCount?: number
    player?: PlayerType
  }

  export type PlayerType = {
    id: string
    login: string
  }