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
    amountOfFinishedGame: number
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
