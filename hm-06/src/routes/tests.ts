import express, { Request, Response } from 'express';
import { HTTP_STATUSES } from '../utils';
import { blogsCollection, postsCollection, usersCollection } from '../db/db';

export const getTestRouter = () => {
    const router = express.Router();

    router.delete('/all-data', async (req: Request, res: Response) => {
        await blogsCollection.deleteMany({});
        await postsCollection.deleteMany({});
        await usersCollection.deleteMany({});
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })

    return router;
}