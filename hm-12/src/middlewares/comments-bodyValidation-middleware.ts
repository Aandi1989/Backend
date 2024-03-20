import { body } from "express-validator";
import { myStatus } from "../types/types";

export const commentCreateValidator = 
    body('content').isString().trim().isLength({min: 20, max: 300})
        .withMessage('Content must be between 20 and 300 characters')

export const commentStatusValidator = body('likeStatus').isIn(Object.values(myStatus))
        .withMessage('Content must be one of the valid statuses');