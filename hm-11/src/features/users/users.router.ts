import { Response, Router } from "express";
import { UserQueryType, userQueryParams } from "../../assets/queryStringModifiers";
import { usersService } from "../../domain/users-service";
import { authenticateUser } from "../../middlewares/authenticateUser-middleware";
import { inputValidationMiddleware } from "../../middlewares/posts-bodyValidation-middleware";
import { userCreateValidator } from "../../middlewares/users-bodyValidation-middleware";
import { userQueryValidationMiddleware, userQueryValidator } from "../../middlewares/users-queryValidation-middleware";
import { usersQueryRepo } from "../../repositories/usersQueryRepository";
import { RequestWithBody, RequestWithParams, RequestWithQuery, UserOutputType, UsersWithQueryType } from "../../types/types";
import { HTTP_STATUSES } from "../../utils";
import { CreateUserModel } from "./models/CreateUserModel";
import { URIParamsUserIdModel } from "./models/URIParamsUserIdModel";

export const usersRouter = Router();

class UsersController {
    async getUsers (req: RequestWithQuery<Partial<UserQueryType>>, res: Response<UsersWithQueryType>) {
        const response = await usersQueryRepo.getUsers(userQueryParams(req.query));
        res.status(HTTP_STATUSES.OK_200).json(response)
    }
    async createUser (req: RequestWithBody<CreateUserModel>, res: Response<UserOutputType>) {
        const newUser =  await usersService.createUser(req.body)
        res.status(HTTP_STATUSES.CREATED_201).send(newUser)
    }
    async deleteUser (req: RequestWithParams<URIParamsUserIdModel>, res: Response) {
        const isDeleted = await usersService.deleteUser(req.params.id)
        isDeleted 
        ? res.send(HTTP_STATUSES.NO_CONTENT_204)
        : res.send(HTTP_STATUSES.NOT_FOUND_404)
    }
}

const usersController = new UsersController();


usersRouter.get('/' , userQueryValidator, userQueryValidationMiddleware, usersController.getUsers),
usersRouter.post('/', authenticateUser, ...userCreateValidator, inputValidationMiddleware, usersController.createUser)
usersRouter.delete('/:id',  authenticateUser , usersController.deleteUser)

