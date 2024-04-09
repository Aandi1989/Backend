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
