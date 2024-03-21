import { Router } from "express";
import { authenticateUser } from "../../middlewares/authenticateUser-middleware";
import { inputValidationMiddleware } from "../../middlewares/posts-bodyValidation-middleware";
import { userCreateValidator } from "../../middlewares/users-bodyValidation-middleware";
import { userQueryValidationMiddleware, userQueryValidator } from "../../middlewares/users-queryValidation-middleware";
import { UsersController } from "../../controllers/usersController";
import { container } from "../../composition-root";

const usersController = container.resolve(UsersController)

export const usersRouter = Router();


usersRouter.get('/' , userQueryValidator, userQueryValidationMiddleware, usersController.getUsers.bind(usersController)),
usersRouter.post('/', authenticateUser, ...userCreateValidator, inputValidationMiddleware, 
    usersController.createUser.bind(usersController))
usersRouter.delete('/:id',  authenticateUser , usersController.deleteUser.bind(usersController))

