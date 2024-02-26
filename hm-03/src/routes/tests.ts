import express, { Request, Response } from 'express';
import { DBType, blogsCollection, postsCollection } from '../db/db';
import { HTTP_STATUSES } from '../utils';

export const getTestRouter = (db: DBType) => {
    const router = express.Router();

    router.delete('/all-data', async (req: Request, res: Response) => {
        await blogsCollection.deleteMany({})
        await postsCollection.deleteMany({})
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })

    return router;
}