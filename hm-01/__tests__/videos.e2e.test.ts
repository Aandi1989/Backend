import request from 'supertest';
import { app } from '../src/app';
import { HTTP_STATUSES } from '../src/utils';
import { VideoResolution, VideoType, db } from '../src/db/db';

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
        .post('/videos')
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

    let createdVideo: any = null;
    it('+ POST should create the video with correct data', async () => {
        const createdResponse = await request(app)
            .post ('/videos')
            .send({title: 'New Video', author: 'New Author' , availableResolutions: ['P360']})
            .expect(HTTP_STATUSES.CREATED_201)

            createdVideo = createdResponse.body;

            await request(app)
                .get('/videos')
                .expect(HTTP_STATUSES.OK_200, [createdVideo])

    })

    it('- GET video by ID with incorrect id', async () => {
        await request(app).get('/videos/incorrectId').expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it('+ GET video by ID with correct id', async () => {
        await request(app)
            .get('/videos/' + createdVideo.id)
            .expect(200, createdVideo)
    })

    it('- PUT video by ID with incorrect data', async () => {
        await request(app)
            .put('/videos/1234')
            .send({ title: 'title', author: 'title',  availableResolutions: ['P360']})
            .expect(HTTP_STATUSES.NOT_FOUND_404)
        
        const res = await request(app).get('/videos/')
        expect(res.body[0]).toEqual(createdVideo)
    })

    it('+ PUT video by ID with correct data', async () => {
        await request(app)
            .put('/videos/' + createdVideo.id)
            .send({
                title: 'hello title',
                author: 'hello author',
                availableResolutions: ['P360'],
            })
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        const res = await request(app).get('/videos')
        expect(res.body[0]).toEqual({
            ...createdVideo,
            title: 'hello title',
            author: 'hello author',
            availableResolutions: ['P360'],
        })
        createdVideo = res.body[0]
    })

    it('- DELETE video by ID with incorrect ID', async () => {
        await request(app)
            .delete('/videos/8934')
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        const res = await request(app).get('/videos')
        expect(res.body[0]).toEqual(createdVideo)
    })

    it('+ DELETE video by correct ID', async () => {
        await request(app)
            .delete('/videos/' + createdVideo.id)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        const res = await request(app).get('/videos')
        expect(res.body.length).toBe(0)
    })
    


})