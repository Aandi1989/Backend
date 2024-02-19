import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";


export const blogPostValidator = [
    body('name').isString().trim().isLength({min: 2, max: 15})
        .withMessage('Name must be between 2 and 15 characters'),
    body('description').isString().trim().isLength({min: 5, max: 500})
        .withMessage('Description must be between 5 and 500 characters'),
    body('websiteUrl').isString().trim().isLength({min: 5, max: 100}).withMessage('Name must be between 8 and 100 characters')
        .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
        .withMessage('Invalid website URL format. It should start with https:// and follow a valid URL pattern.')
]

export const blogUpdateValidator = [
    body('name').optional().isString().trim().isLength({min: 2, max: 15})
        .withMessage('Name must be between 2 and 15 characters'),
    body('description').optional().isString().trim().isLength({min: 5, max: 500})
        .withMessage('Description must be between 5 and 500 characters'),
    body('websiteUrl').optional().isString().trim().isLength({min: 5, max: 100}).withMessage('Name must be between 8 and 100 characters')
        .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
        .withMessage('Invalid website URL format. It should start with https:// and follow a valid URL pattern.')
]

export const postCreateValidator = [
    body('title').isString().trim().isLength({min: 2, max: 30})
        .withMessage('Title must be between 2 and 30 characters'),
    body('shortDescription').isString().trim().isLength({min: 5, max: 100})
        .withMessage('Short description must be between 5 and 100 characters'), 
    body('content').isString().trim().isLength({min: 5, max: 1000})
        .withMessage('Content must be between 5 and 1000 characters'),  
    body('blogId').isString().trim().isLength({min: 1, max: 30})
        .withMessage('Blog Id must be between 5 and 30 characters'), 
    body('blogName').optional().isString().trim().isLength({min: 5, max: 30})
        .withMessage('Blog Name  must be between 5 and 30 characters'),      
]

export const postUpdateValidator = [
    body('title').optional().isString().trim().isLength({min: 2, max: 30})
        .withMessage('Title must be between 2 and 30 characters'),
    body('shortDescription').optional().isString().trim().isLength({min: 5, max: 100})
        .withMessage('Short description must be between 5 and 100 characters'), 
    body('content').optional().isString().trim().isLength({min: 5, max: 1000})
        .withMessage('Content must be between 5 and 1000 characters'),  
    body('blogId').optional().isString().trim().isLength({min: 1, max: 30})
        .withMessage('Blog Id must be between 1 and 30 characters'), 
    body('blogName').optional().isString().trim().isLength({min: 5, max: 30})
        .withMessage('Blog Name  must be between 5 and 30 characters'),      
]

export const inputValidationMiddleware = (req:Request, res: Response, next: NextFunction) => {
    let errors = validationResult(req)
    .formatWith(customFormatter)
    if(!errors.isEmpty()){
       // Delete duplications of errors
       const uniqueErrors = removeDuplicateErrors(errors.array());
       return res.status(400).json({ errorsMessages: uniqueErrors });
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

function removeDuplicateErrors(errors:any) {
    const uniqueErrors = errors.reduce((acc: any, current: any) => {
        //@ts-ignore
        const existingError = acc.find(error => error.field === current.field);
        if (!existingError) {
            acc.push(current);
        }
        return acc;
    }, []);
return uniqueErrors;
}