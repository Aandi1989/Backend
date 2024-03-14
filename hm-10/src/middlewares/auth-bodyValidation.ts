import { body } from "express-validator";

export const authValidator = [
    body('loginOrEmail').notEmpty().isString().withMessage('Field is required'),
    body('password').notEmpty().isString().withMessage('Password is required'), 
]

