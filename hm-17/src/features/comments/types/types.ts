export class CommentSQL {
    id: string
    content: string
    postId: string
    userId: string
    createdAt: string
}


export enum myStatus {
    None = "None",
    Like = "Like",
    Dislike = "Dislike"
}

export class Like  {
    id: string
    status: myStatus
    userId: string
    parentId: string
    createdAt: string
}

export type CommentQueryType = {
    sortBy: CommentSortBy,
    sortDirection: sortDirectionType,
    pageNumber: string,
    pageSize: string
}

export type CommentQueryOutputType = {
    sortBy: CommentSortBy,
    sortDirection: sortDirectionType,
    pageNumber: number,
    pageSize: number
}

type CommentSortBy = "id" | "content" | "createdAt";

type sortDirectionType = "asc" | "desc";