import express, { Request, Response } from 'express';
import { HTTP_STATUSES } from '../utils';

export const getTestRouter = () => {
    const router = express.Router();

    router.delete('/all-data', (req: Request, res: Response) => {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })

    return router;
}