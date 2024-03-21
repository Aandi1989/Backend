import { Request } from "express"
import { ObjectId } from "mongodb"

export type RequestWithBody<T> = Request<{}, {}, T>
export type RequestWithQuery<T> = Request<{}, {}, {}, T>
export type RequestWithParams<T> = Request<T>
export type RequestWithParamsAndQuery<T,B>=Request<T,{},{},B>
export type RequestWithParamsAndBodyAndUserId<P, B, U extends Record<string, any>>=Request<P, {}, B, {}, U>
export type RequestWithParamsAndUserId<T, U extends Record<string, any>>=Request<T, {}, {}, {}, U>
export type RequestWithParamsAndBody<T, B> = Request<T, {}, B>

export type BlogType = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}

export type DBBlogType = {
    _id:ObjectId,
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}

export type PostType = {
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

export type BlogsWithQueryType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: BlogType[]
}

export type PostsWithQueryType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: PostType[]
}

export type UsersWithQueryType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: UserOutputType[]
}

export type UserType = {
    id:string
    login:string
    email:string
    createdAt:string
    passwordHash:string
    passwordSalt:string
}

export type UserAuthType ={
    userId: string
    login: string
    email: string
}

export type UserOutputType = {
    id:string
    login:string
    email:string
    createdAt:string
}

export type codeRecoveryType = {
    recoveryCode: string,
    expirationDate: Date,
    isConfirmed: boolean
}

export enum ResultCode {
    Success = 'Success',
    NotFound = 'NotFound',
    Forbidden = 'Forbidden',
    Failed = 'Failed',
    AlredyConfirmed = 'AlredyConfirmed',
    Expired = 'Expired'
}

export type Result = {
    code: ResultCode;
    errorsMessages?: errorMessageType;
    data?: any
}

export enum myStatus {
    None = "None",
    Like = "Like",
    Dislike = "Dislike"
}

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

export type errorMessageType = {
    errorsMessages:{
        message: string,
        field: string
    }[]
}

export type refreshTokenType = {
    refreshToken: string
}

export type sessionType = {
    userId: string
    deviceId: string
    iat: string
    deviceName: string
    ip: string
    exp: string
}

export type DBsessionType = {
    _id: ObjectId
    userId: string
    deviceId: string
    iat: string
    deviceName: string
    ip: string
    exp: string
}

export type apiCallType = {
    ip: string
    url: string
    date: Date
}

export type refreshTokenDataType = {
    userId: string
    deviceId: string
    iat: number
    exp: number
}

export type likeType = {
    id: string
    status: myStatus
    userId: string
    parentId: string
    createdAt: string
}






