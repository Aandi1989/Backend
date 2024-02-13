import express,{ Express, Response, Router } from "express";
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from "../../types";
import { CourseType, DBType, UserType } from "../../db/db";
import { HTTP_STATUSES } from "../../utils";
import { UserViewModel } from "./models/UserViewModel";
import { CreateUserModel } from "./models/CreateUserModel";
import { QueryUsersModel } from "./models/QueryUsersModel";
import { URIParamsUserIdModel } from "./models/URIParamsUserIdModel";
import { UpdateUserModel } from "./models/UpdateUserModel";


export const mapEntityToViewModel = (dbEntity: UserType): UserViewModel => {
    return {
        id: dbEntity.id,
        userName: dbEntity.userName
    }
}



export const getUsersRouter = (db: DBType) => {
    const router = express.Router();

    router.get('/', (req: RequestWithQuery<QueryUsersModel>,
        res: Response<UserViewModel[]>) => {
        let foundedEntities = db.users;

        if (req.query.userName) {
            foundedEntities = foundedEntities.filter(c => c.userName.indexOf(req.query.userName) > -1)
        }


        res.json(foundedEntities.map(mapEntityToViewModel))
    })
    router.get('/:id', (req: RequestWithParams<URIParamsUserIdModel>,
        res: Response<UserViewModel>) => {
        const foundEntity = db.users.find(c => c.id === +req.params.id)
        if (!foundEntity) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        res.json(mapEntityToViewModel(foundEntity))
    })
    router.post('/', (req: RequestWithBody<CreateUserModel>,
        res: Response<UserViewModel>) => {
        if (!req.body.userName) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return;
        }

        const createdEntity: UserType = {
            id: +(new Date()),
            userName: req.body.userName
        }
        db.users.push(createdEntity)
        res
            .status(HTTP_STATUSES.CREATED_201)
            .json(mapEntityToViewModel(createdEntity))
    })
    router.delete('/:id', (req: RequestWithParams<URIParamsUserIdModel>,
        res) => {
        db.users = db.users.filter(c => c.id !== +req.params.id)

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })
    router.put('/:id', (req: RequestWithParamsAndBody<URIParamsUserIdModel,
        UpdateUserModel>, res) => {
        if (!req.body.userName) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return;
        }

        const foundUser = db.users.find(c => c.id === +req.params.id)
        if (!foundUser) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        foundUser.userName = req.body.userName

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }) 

    return router;
}





