import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { HTTP_STATUSES } from '../utils/utils';
import { ErrorResponse } from '../types/types';


@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    // this logic written for returnin name of the field where our mistake occurs
    if(status === HTTP_STATUSES.BAD_REQUEST_400){
        const errorResponse: ErrorResponse  = {
            errorsMessages: []
        };
        const responseBody: any = exception.getResponse();

        if(responseBody.error){
            responseBody.message.forEach((m) => {
            errorResponse.errorsMessages.push(m)
          });
          response.status(status).json(errorResponse)
        }

        response.status(status).json()
    // ----------------------------------------------------
    }else{
        response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}