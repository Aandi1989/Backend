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

  class AnswerOutputModel {
    questionId: string
    answerStatus: string
    addedAt: string
  }

  class QuestionOutputModel {
    id: string
    body: string
  }