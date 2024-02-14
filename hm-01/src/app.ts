import express, { Request, Response } from 'express'
import { VideoResolution, VideoType, db } from './db/db';
import { HTTP_STATUSES } from './utils';
import { RequestWithBody, RequestWithParams } from './types';
import { CreateVideoModel } from './models/CreateVideoModel';
import { URIParamsVideoIdModel } from './models/URIParamsVideoModel';


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
    }
    if (typeof author !== 'string' || author.trim() === '') {
        errors.push({ message: 'Author required and must be strings', field: 'author' });
    }
    if (!availableResolutions || availableResolutions.length === 0) {
        errors.push({ message: 'At least one resolution must be provided', field: 'availableResolutions' });
    } else {
        const invalidResolutions = [...availableResolutions].filter(resolution => !Object.values(VideoResolution).includes(resolution));
        if (invalidResolutions.length > 0) {
            errors.push({ message: 'Invalid resolution(s)', field: 'availableResolutions' });
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
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: createdAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
        availableResolutions: [...availableResolutions]
    }
    db.videos.push(createdVideo)
    res.status(HTTP_STATUSES.CREATED_201).json(createdVideo)

})
app.get('/videos/:id', (req: RequestWithParams<URIParamsVideoIdModel>, 
                        res: Response) => {
    const foundVideo = db.videos.find(v => v.id === +req.params.id)
    if(!foundVideo) {
       return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
    
    res.json(foundVideo)
})
/*
    const dateString = "2024-02-14T16:28:37.446Z";
    const date = new Date(dateString);
    // Проверяем, является ли объект даты недействительным (Invalid Date)
    if (isNaN(date.getTime())) {
        console.log("Строка не является допустимой датой формата toISOString()");
    } else {
        console.log("Строка является допустимой датой формата toISOString()");
    }

    
    
    
    function isValidISOStringDate(dateString: string): boolean {
    const parsedDate = Date.parse(dateString);
    return !isNaN(parsedDate);
    }

    const userInput = "2024-02-14T16:28:37.446Z";
    if (isValidISOStringDate(userInput)) {
        const date = new Date(userInput);
        const isoString = date.toISOString();
        console.log(`Введенное значение "${userInput}" может быть преобразовано в дату и имеет строковое представление: "${isoString}"`);
    } else {
        console.log(`Введенное значение "${userInput}" не может быть преобразовано в дату.`);
    }
*/

app.delete('/testing/all-data', (req: Request, res: Response) => {
    db.videos = [];
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
})