import { NextFunction, Request, Response } from "express";
import { param, validationResult } from "express-validator";

export const blogIdValidator = param('blogId').isString().trim().isLength({min: 6, max: 30})
.withMessage('Blog Id must be between 6 and 30 characters')

export const blogIdValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }else{
        next()
    }
};