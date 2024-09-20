export class QuestionType {
    id:string;
    body: string;
    correctAnswers: (string | number)[];
    published: boolean;
    createdAt: string;
    updatedAt?: string;
}

export class UpdateQuestionType {
    body: string;
    correctAnswers: (string | number)[];
    updatedAt: string;
}

export type QuestionQueryType = {
    bodySearchTerm: string | null,
    sortBy: QuestionSortBy,
    sortDirection: sortDirectionType,
    publishedStatus: publishedStatus,
    pageNumber: string,
    pageSize: string
}

export type QuestionQueryOutputType = {
    bodySearchTerm: string | null,
    sortBy: QuestionSortBy,
    sortDirection: sortDirectionType,
    publishedStatus: publishedStatus,
    pageNumber: number,
    pageSize: number
}

type QuestionSortBy = "id" | "body" | "createdAt" | "updatedAt" | "correctAnswers"

type sortDirectionType = "asc" | "desc";

type publishedStatus = "all" | "published" | "notPublished";