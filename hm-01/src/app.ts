import express, { Request, Response } from 'express'
import { VideoResolution, VideoType, db } from './db/db';
import { HTTP_STATUSES } from './utils';
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody } from './types';
import { CreateVideoModel } from './models/CreateVideoModel';
import { URIParamsVideoIdModel } from './models/URIParamsVideoModel';
import { UpdateVideoModel } from './models/UpdateVideoModel';


export const app = express();

const jsonBodyMiddleware = express.json();

app.use(jsonBodyMiddleware);

app.get('/videos', (req: Request, res: Response) => {
    res.status(HTTP_STATUSES.OK_200).json(db.videos)
})
app.post('/videos', (req: RequestWithBody<CreateVideoModel>,
    res: Response) => {
    const { title, author, availableResolutions } = req.body;

    const errors: { message: string; field: string }[] = [];

    if (typeof title !== 'string' || title.trim() === '') {
        errors.push({ message: 'Title required and must be strings', field: 'title' });
    }else if (!/^[a-zA-Z\s.,!?'"-]+$/g.test(title)) {
        errors.push({ message: 'Title required and must be strings', field: 'title' });
    }
    if (typeof author !== 'string' || author.trim() === '') {
        errors.push({ message: 'Author required and must be strings', field: 'author' });
    }else if (!/^[a-zA-Z\s.,!?'"-]+$/g.test(author)) {
        errors.push({ message: 'Author required and must be strings', field: 'author' });
    }
    const resolutionsArray = Array.isArray(availableResolutions) ? availableResolutions : [availableResolutions];
    if (!resolutionsArray || resolutionsArray.length === 0) {
        errors.push({ message: 'At least one resolution must be provided', field: 'availableResolutions' });
    } else {
        const invalidResolutions = resolutionsArray.filter(resolution => !Object.values(VideoResolution).includes(resolution));
        if (invalidResolutions.length > 0) {
            errors.push({ message: 'At least one resolution must be provided', field: 'availableResolutions' });
        }
    }
    if (errors.length > 0) {
        return res.status(400).json({ errorsMessages: errors });
    }

    const createdAt = new Date();
    const publicationDate = new Date(createdAt);
    publicationDate.setDate(createdAt.getDate() + 1);

    const createdVideo: VideoType = {
        id: +(new Date()),
        title: title,
        author: author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
        availableResolutions: resolutionsArray
    }
    db.videos.push(createdVideo)
    res.status(HTTP_STATUSES.CREATED_201).json(createdVideo)

})
app.get('/videos/:id', (req: RequestWithParams<URIParamsVideoIdModel>,
    res: Response) => {
    const foundVideo = db.videos.find(v => v.id === +req.params.id)
    if (!foundVideo) {
        return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }

    res.json(foundVideo)
})
app.put('/videos/:id', (req: RequestWithParamsAndBody<URIParamsVideoIdModel, UpdateVideoModel>,
    res) => {
    const { title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate } = req.body;
    const errors: { message: string; field: string }[] = [];

    if (typeof title !== 'string' || title.trim() === '') {
        errors.push({ message: 'Title required and must be strings', field: 'title' });
    }else if (!/^[a-zA-Z\s.,!?'"-]+$/g.test(title)) {
        errors.push({ message: 'Title required and must be strings', field: 'title' });
    }
    if (typeof author !== 'string' || author.trim() === '') {
        errors.push({ message: 'Author required and must be strings', field: 'author' });
    }else if (!/^[a-zA-Z\s.,!?'"-]+$/g.test(author)) {
        errors.push({ message: 'Author required and must be strings', field: 'author' });
    }
    if (typeof canBeDownloaded != 'boolean') {
        errors.push({ message: 'CanBeDownloaded can be only true or false', field: 'canBeDownloaded' });
    }
    if (minAgeRestriction !== null && (typeof minAgeRestriction !== 'number' || minAgeRestriction > 18)) {
        errors.push({ message: 'MinAgeRestriction must be either null or a number less than or equal to 18', field: 'minAgeRestriction' });
    }
    if (typeof publicationDate !== 'string' || !isValidISOString(publicationDate)) {
        errors.push({ message: 'Publication date must be a valid date.', field: 'publicationDate' });
    }
    const resolutionsArray = Array.isArray(availableResolutions) ? availableResolutions : [availableResolutions];
    if (!resolutionsArray || resolutionsArray.length === 0) {
        errors.push({ message: 'At least one resolution must be provided', field: 'availableResolutions' });
    } else {
        const invalidResolutions = resolutionsArray.filter(resolution => !Object.values(VideoResolution).includes(resolution));
        if (invalidResolutions.length > 0) {
            errors.push({ message: 'Invalid resolution(s)', field: 'availableResolutions' });
        }
    }
    if (errors.length > 0) {
        return res.status(400).json({ errorsMessages: errors });
    }

    let foundVideo = db.videos.find(v => v.id === +req.params.id)

    if(!foundVideo){
        return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }

   

    foundVideo = {
        ...foundVideo,
        title, author, availableResolutions, 
        canBeDownloaded, 
        minAgeRestriction, publicationDate
    }

    db.videos = db.videos.filter(v => v.id != foundVideo!.id);
    db.videos.push(foundVideo);

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})
app.delete('/videos/:id', (req: RequestWithParams<URIParamsVideoIdModel>, 
                            res:Response) =>{
    const foundVideo = db.videos.find(v => v.id === +req.params.id)
    if (!foundVideo) {
        return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }

    db.videos = db.videos.filter(v => v.id != foundVideo!.id);

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

app.delete('/testing/all-data', (req: Request, res: Response) => {
    db.videos = [];
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
})


const isValidISOString = (str: any) => {
    const isValidDate = !isNaN(Date.parse(str));

    const isISOString = new Date(str).toISOString() === str;

    return isValidDate && isISOString;
};
