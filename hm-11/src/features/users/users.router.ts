import { Response, Router } from "express";
import { UserQueryType, userQueryParams } from "../../assets/queryStringModifiers";
import { UsersService } from "../../domain/users-service";
import { authenticateUser } from "../../middlewares/authenticateUser-middleware";
import { inputValidationMiddleware } from "../../middlewares/posts-bodyValidation-middleware";
import { userCreateValidator } from "../../middlewares/users-bodyValidation-middleware";
import { userQueryValidationMiddleware, userQueryValidator } from "../../middlewares/users-queryValidation-middleware";
import { UsersQueryRepo } from "../../repositories/usersQueryRepository";
import { RequestWithBody, RequestWithParams, RequestWithQuery, UserOutputType, UsersWithQueryType } from "../../types/types";
import { HTTP_STATUSES } from "../../utils";
import { CreateUserModel } from "./models/CreateUserModel";
import { URIParamsUserIdModel } from "./models/URIParamsUserIdModel";

export const usersRouter = Router();

class UsersController {
    usersService: UsersService;
    usersQueryRepo: UsersQueryRepo;
    constructor(){
        this.usersService = new UsersService(),
        this.usersQueryRepo = new UsersQueryRepo()
    }
    async getUsers (req: RequestWithQuery<Partial<UserQueryType>>, res: Response<UsersWithQueryType>) {
        const response = await this.usersQueryRepo.getUsers(userQueryParams(req.query));
        res.status(HTTP_STATUSES.OK_200).json(response)
    }
    async createUser (req: RequestWithBody<CreateUserModel>, res: Response<UserOutputType>) {
        const newUser =  await this.usersService.createUser(req.body)
        res.status(HTTP_STATUSES.CREATED_201).send(newUser)
    }
    async deleteUser (req: RequestWithParams<URIParamsUserIdModel>, res: Response) {
        const isDeleted = await this.usersService.deleteUser(req.params.id)
        if(isDeleted) return res.send(HTTP_STATUSES.NO_CONTENT_204);
        return res.send(HTTP_STATUSES.NOT_FOUND_404);
    }
}

const usersController = new UsersController();


usersRouter.get('/' , userQueryValidator, userQueryValidationMiddleware, usersController.getUsers.bind(usersController)),
usersRouter.post('/', authenticateUser, ...userCreateValidator, inputValidationMiddleware, 
    usersController.createUser.bind(usersController))
usersRouter.delete('/:id',  authenticateUser , usersController.deleteUser.bind(usersController))

