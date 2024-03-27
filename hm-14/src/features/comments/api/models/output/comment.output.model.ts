import { CommentType } from "src/features/comments/types/types"

export class CommentsWithQueryOutputModel {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: CommentType[]
}