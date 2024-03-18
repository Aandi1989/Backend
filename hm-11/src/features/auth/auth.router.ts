import { Router } from "express";
import { authController } from "../../composition-root";
import { accessTokenGuard } from "../../middlewares/access-token-guard-middleware";
import { apiCallsGuard } from "../../middlewares/api-calls-limit-guard-middleware";
import { authValidator } from "../../middlewares/auth-bodyValidation";
import { inputValidationMiddleware } from "../../middlewares/posts-bodyValidation-middleware";
import { emailCofirmCodeValidator, emailValidator, newPasswordValidator, userCreateValidator } from "../../middlewares/users-bodyValidation-middleware";


export const authRouter = Router();


authRouter.get('/me', accessTokenGuard, authController.me.bind(authController))
authRouter.post('/login', ...authValidator, inputValidationMiddleware, apiCallsGuard, authController.login.bind(authController))
authRouter.post('/logout', authController.logout.bind(authController))
authRouter.post('/refresh-token', authController.refreshToken.bind(authController))
authRouter.post('/registration', ...userCreateValidator, inputValidationMiddleware, apiCallsGuard, 
    authController.refreshToken.bind(authController))
authRouter.post('/registration-confirmation', emailCofirmCodeValidator, inputValidationMiddleware, apiCallsGuard, 
    authController.registrationConfirmation.bind(authController))
authRouter.post('/registration-email-resending', emailValidator, inputValidationMiddleware, apiCallsGuard, 
    authController.registrationEmailResending.bind(authController)) 
authRouter.post('/password-recovery', emailValidator, inputValidationMiddleware, apiCallsGuard, 
    authController.passwordRecovery.bind(authController))
authRouter.post('/new-password', newPasswordValidator, inputValidationMiddleware, apiCallsGuard, 
    authController.newPassword.bind(authController))
