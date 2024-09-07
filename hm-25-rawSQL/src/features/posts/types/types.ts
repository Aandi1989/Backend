import { ObjectId } from "mongodb";

export class PostSQL {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName?: string
    createdAt: string
}

export class PostType  {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName?: string
    createdAt: string
    extendedLikesInfo: {
        likesCount: number
        dislikesCount: number
        myStatus: myStatus
        newestLikes: {
            addedAt: string
            userId: string
            login: string
        }[]
    }
}

export type DBPostType = {
    _id: ObjectId,
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName?: string,
    createdAt: string
    extendedLikesInfo: {
        likesCount: number
        dislikesCount: number
        myStatus: myStatus
        newestLikes: {
            addedAt: string
            userId: string
            login: string
        }[]
    }
}

export type PostQueryType = {
    sortBy: PostSortBy,
    sortDirection: sortDirectionType,
    pageNumber: string,
    pageSize: string
}

export type PostQueryOutputType = {
    sortBy: PostSortBy,
    sortDirection: sortDirectionType,
    pageNumber: number,
    pageSize: number
}

export enum myStatus {
    None = "None",
    Like = "Like",
    Dislike = "Dislike"
}

export type newestLikeType = {
    addedAt: string
    userId: string
    login: string
}

type PostSortBy = "id" | "title" | "shortDescription" | "content" | "blogId" | "blogName" | "createdAt";

type sortDirectionType = "asc" | "desc";