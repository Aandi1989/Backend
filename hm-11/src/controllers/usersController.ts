import { Response, Router } from "express";
import { UserQueryType, userQueryParams } from "../assets/queryStringModifiers";
import { UsersService } from "../domain/users-service";
import { CreateUserModel } from "../features/users/models/CreateUserModel";
import { URIParamsUserIdModel } from "../features/users/models/URIParamsUserIdModel";
import { UsersQueryRepo } from "../repositories/usersQueryRepository";
import { RequestWithQuery, UsersWithQueryType, RequestWithBody, UserOutputType, RequestWithParams } from "../types/types";
import { HTTP_STATUSES } from "../utils";

export class UsersController {
    constructor(protected usersService: UsersService,
                protected usersQueryRepo: UsersQueryRepo){}
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