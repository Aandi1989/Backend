import express, { Response, Request } from "express";
import { userCreateValidator } from "../../middlewares/users-bodyValidation-middleware";
import { inputValidationMiddleware } from "../../middlewares/posts-bodyValidation-middleware";
import { RequestWithBody, RequestWithParams, RequestWithQuery, UserOutputType, UserType, UsersWithQueryType } from "../../types/types";
import { CreateUserModel } from "./models/CreateUserModel";
import { HTTP_STATUSES } from "../../utils";
import { usersService } from "../../domain/users-service";
import { authenticateUser } from "../../middlewares/authenticateUser-middleware";
import { URIParamsUserIdModel } from "./models/URIParamsUserIdModel";
import { userQueryValidationMiddleware, userQueryValidator } from "../../middlewares/users-queryValidation-middleware";
import { UserQueryType, userQueryParams } from "../../assets/queryStringModifiers";
import { usersQueryRepo } from "../../repositories/usersQueryRepository";

export const getUsersRouter = () => {
    const router = express.Router();

    router.get('/',
        userQueryValidator,
        userQueryValidationMiddleware,
        async(req: RequestWithQuery<Partial<UserQueryType>>, res: Response<UsersWithQueryType>) => {
            const response = await usersQueryRepo.getUsers(userQueryParams(req.query));
            res.status(HTTP_STATUSES.OK_200).json(response)
        }
    )
    router.post('/',
        authenticateUser,
        ...userCreateValidator,
        inputValidationMiddleware,
        async (req: RequestWithBody<CreateUserModel>, res: Response<UserOutputType>) => {
            const newUser =  await usersService.createUser(req.body)
            res.status(HTTP_STATUSES.CREATED_201).send(newUser)
    }),
    router.delete('/:id',
        authenticateUser,
        async(req: RequestWithParams<URIParamsUserIdModel>, res: Response) => {
            const isDeleted = await usersService.deleteUser(req.params.id)
            isDeleted 
            ? res.send(HTTP_STATUSES.NO_CONTENT_204)
            : res.send(HTTP_STATUSES.NOT_FOUND_404)
    })


    return router;
}