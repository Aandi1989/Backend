export class QuestionOutputModel {
    id: string
    body: string
    correctAnswers: (string | number)[]
    published: boolean
    createdAt: string
    updatedAt: string
}