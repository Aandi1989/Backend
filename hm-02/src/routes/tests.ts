import express, { Request, Response } from 'express';
import { DBType } from '../db/db';
import { HTTP_STATUSES } from '../utils';

export const getTestRouter = (db: DBType) => {
    const router = express.Router();

    router.delete('/all-data', (req: Request, res: Response) => {
        db.blogs = [];
        db.posts = [];
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })

    return router;
}