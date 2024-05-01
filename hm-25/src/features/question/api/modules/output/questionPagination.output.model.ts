import { QuestionType } from "../../../types/types";

export class QuestionsWithQueryOutputModel {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: QuestionType[];
}