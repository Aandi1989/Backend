import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const commentCreateValidator = 
    body('content').isString().trim().isLength({min: 20, max: 300})
        .withMessage('Content must be between 20 and 300 characters')
