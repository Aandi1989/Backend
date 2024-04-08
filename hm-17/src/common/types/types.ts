import { myStatus } from "src/features/posts/types/types";

export type Result = {
    code: ResultCode;
    errorsMessages?: ErrorType[];
    data?: any
}

export type errorMessageType = {
    errorsMessages:{
        message: string,
        field: string
    }[]
}

export enum ResultCode {
    Success = 'Success',
    NotFound = 'NotFound',
    Forbidden = 'Forbidden',
    Failed = 'Failed',
    AlredyConfirmed = 'AlredyConfirmed',
    Expired = 'Expired'
}

export type ErrorResponse = {
    errorsMessages: ErrorType[];
  }

export type ErrorType = {
    message: string
    field: string
}


// export class BlogSQL {
//     id: string
//     name: string
//     description: string
//     websiteUrl: string
//     createdAt: string
//     isMembership: boolean
// }

export class PostSQL {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName?: string
    createdAt: string
}

export class CommentSQL {
    id: string
    content: string
    postId: string
    userId: string
    createdAt: string
}

export class UserSQL {
    id:string
    login:string
    email:string
    createdAt:string
    passwordHash:string
    passwordSalt:string
    confirmationCode?: string
    confCodeExpDate?: Date
    confCodeConfirmed?: boolean
    recoveryCode?: string
    recCodeExpDate?: Date
    recCodeConfirmed?: boolean
}

export class LikeSQL {
    id: string
    status: myStatus
    userId: string
    parentId: string
    createdAt: string
}

export class SessionSQL {
    id: string
    userId: string
    deviceId: string
    deviceName: string
    iat: string
    exp: string
    ip: string
}

export class ApiCallSQL {
    ip: string
    url: string
    date: Date
}