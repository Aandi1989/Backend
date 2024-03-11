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

export type DBUserType = {
    _id:ObjectId,
    id:string,
    login:string,
    email:string,
    passwordHash:string,
    passwordSalt:string,
    createdAt:string,
}

export type UserAccountDBType = {
    _id:ObjectId,
    accountData: UserType,
    emailConfirmation: {
        confirmationCode: string,
        expirationDate: Date
        isConfirmed: boolean
    }
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

export type CommentType = {
    id: string
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    },
    createdAt: string
}

export type DBCommentType = {
    id: string
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    },
    createdAt: string
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
