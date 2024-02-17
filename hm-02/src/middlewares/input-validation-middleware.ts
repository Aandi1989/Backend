import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";


export const blogPostValidator = [
    body('name').isString().trim().isLength({min: 2, max: 15})
        .withMessage('Name must be between 2 and 15 characters'),
    body('description').isString().trim().isLength({min: 5, max: 500})
        .withMessage('Description must be between 5 and 500 characters'),
    body('websiteUrl').isString().trim().isLength({min: 5, max: 100})
        .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
        .withMessage('Invalid website URL format. It should start with https:// and follow a valid URL pattern.')
]

export const inputValidationMiddleware = (req:Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    .formatWith(customFormatter)
    if(!errors.isEmpty()){
        return res.status(400).json({errorsMessages: errors.array()})
    }else{
        next();
    }
}

const customFormatter = (error: any) => {
    return {
      field: error.path,
      message: error.msg
    };
  };