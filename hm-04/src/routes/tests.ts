import express, { Request, Response } from 'express';
import { HTTP_STATUSES } from '../utils';
import { blogsCollection, postsCollection } from '../db/db';

export const getTestRouter = () => {
    const router = express.Router();

    router.delete('/all-data', async (req: Request, res: Response) => {
        await blogsCollection.drop();
        await postsCollection.drop();

        // const blogsCount = await blogsCollection.countDocuments();
        // const postsCount = await postsCollection.countDocuments();
        // console.log("Remaining blogs count:", blogsCount);
        // console.log("Remaining posts count:", postsCount);
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })

    return router;
}