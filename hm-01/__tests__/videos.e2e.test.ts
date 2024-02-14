import request from 'supertest';
import { app } from '../src/app';
import { HTTP_STATUSES } from '../src/utils';
import { VideoResolution, db } from '../src/db/db';

describe('/videos', () => {
    beforeAll( async() => {
        await request(app).delete('/testing/all-data')
    })

    it('+ GET should return 200 and empty array', async () => {
        await request(app)
        .get('/videos')
        .expect(HTTP_STATUSES.OK_200, [])
    })

    it('- POST should not create the video with incorrect data (no title, no author, no availableResolutions)', async () =>{
        await request(app)
        .post('/videos/')
        .send({ title: '', author: '' , availableResolutions: ''})
        .expect(HTTP_STATUSES.BAD_REQUEST_400, {
            errorsMessages: [
                {"message": "Title required and must be strings","field": "title"},
                {"message": "Author required and must be strings","field": "author"},
                {"message": "At least one resolution must be provided","field": "availableResolutions"}
            ]
        })

        const res = await request(app).get('/videos')
        expect(res.body).toEqual([])
    })

    it('- GET video by ID with incorrect id', async () => {
        await request(app).get('/videos/incorrectId').expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it('+ GET video by ID with correct id', async () => {
        const createdAt = new Date();
        const publicationDate = new Date(createdAt);
        publicationDate.setDate(createdAt.getDate() + 1);

        const newVideo = {
            id: +(new Date()),
            title: "New Video",
            author: "John Smith",
            canBeDownloaded: true,
            minAgeRestriction: null,
            createdAt: createdAt.toISOString(),
            publicationDate: publicationDate.toISOString(),
            availableResolutions: [
                VideoResolution.P144
            ]
        }
        db.videos.push(newVideo);
        await request(app)
            .get('/videos/' + newVideo!.id)
            .expect(200, newVideo)
    })
    


})