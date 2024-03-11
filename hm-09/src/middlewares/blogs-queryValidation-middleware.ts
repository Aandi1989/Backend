import { NextFunction, Request, Response } from "express";
import { query, validationResult } from "express-validator";

const sortByRegex = /^(id|name|description|websiteUrl|createdAt|isMembership|null)$/;
const sortDirectionRegex = /^(asc|desc|null)$/;

export const blogQueryValidator = [
    query('pageNumber').optional().isInt().withMessage('Page Number must be integer'),
    query('pageSize').optional().isInt().withMessage('Page Size must be integer'),
    query('searchNameTerm').optional(),
    query('sortBy').optional().matches(sortByRegex).withMessage('Invalid sortBy value'),
    query('sortDirection').optional().matches(sortDirectionRegex).withMessage('Invalid sortDirection value'),
]

export const blogQueryValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }else{
        next()
    }
};