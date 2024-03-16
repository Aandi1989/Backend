import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const userCreateValidator = [
    body('login').isString().trim().isLength({min: 3, max: 10})
        .withMessage('Login must be between 3 and 10 characters').matches(/^[a-zA-Z0-9_-]*$/),
    body('password').isString().trim().isLength({min: 6, max: 20})
        .withMessage('Password must be between 6 and 20 characters'), 
    body('email').isString().trim().isLength({min: 5, max: 1000}).matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
        .withMessage('Invalid email address'),  
]

export const emailCofirmCodeValidator = body('code').isString().trim().isLength({min: 5})
    .withMessage('Confirmation code must be longer than 5 characters')


export const emailValidator = body('email').isString().trim().isLength({min: 5, max: 1000}).matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
.withMessage('Invalid email address')

export const newPasswordValidator = body('newPassword').isString().trim().isLength({min: 6, max: 20})
.withMessage('Password must be between 6 and 20 characters')

