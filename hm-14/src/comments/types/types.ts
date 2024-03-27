import { ObjectId } from "mongodb";

export type CommentType = {
    id: string
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    },
    createdAt: string
    likesInfo: {
        likesCount: number
        dislikesCount: number
        myStatus: myStatus
    }
}

export type DBCommentType = {
    id: string
    content: string
    postId: string
    commentatorInfo: {
        userId: string
        userLogin: string
    },
    createdAt: string
    likes: likeType[]
    dislikes: likeType[]
    _id: ObjectId
}

export type CommentsWithQueryType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: CommentType[]
}

export enum myStatus {
    None = "None",
    Like = "Like",
    Dislike = "Dislike"
}

export type likeType = {
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