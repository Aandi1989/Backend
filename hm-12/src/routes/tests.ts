import express, { Request, Response } from 'express';
import { HTTP_STATUSES } from '../utils';
import { blogsModel, postsModel, commentsModel, usersModel, sessionsModel, apiCallsModel, likesModel } from '../db/models';

export const getTestRouter = () => {
    const router = express.Router();

    router.delete('/all-data', async (req: Request, res: Response) => {
        await blogsModel.deleteMany({});
        await postsModel.deleteMany({});
        await commentsModel.deleteMany({});
        await usersModel.deleteMany({});
        await sessionsModel.deleteMany({});
        await apiCallsModel.deleteMany({});
        await likesModel.deleteMany({});
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })

    return router;
}