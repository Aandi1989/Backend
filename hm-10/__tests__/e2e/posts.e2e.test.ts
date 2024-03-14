import request from 'supertest';
import { app } from '../../src/app';
import { HTTP_STATUSES, RouterPaths } from '../../src/utils';
import { postsCollection } from '../../src/db/db';



const getRequest = () => {
    return request(app);
}

describe('tests for /posts', () => {
    beforeAll( async () => {
        await getRequest().delete(`${RouterPaths.__test__}/all-data`)
    })

    it('+ GET should return 200 and empty array', async () => {
        await getRequest()
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it(' - POST should return 401 for unauthorithed user', async () => {
        await getRequest()
            .post(RouterPaths.posts)
            .set('Authorization', 'Basic invalidUserName')
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })

    it('- POST should not create the post with incorrect data', async () =>{
        await getRequest()
        .post(RouterPaths.posts)
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send({ title: 'd', shortDescription: 'Des' , content: 'rl', blogId: '', blogName:''})
        .expect(HTTP_STATUSES.BAD_REQUEST_400, {
            errorsMessages: [
                {"field": "title","message": "Title must be between 2 and 30 characters"},
                {"field": "shortDescription","message": "Short description must be between 5 and 100 characters"},
                {"field": "content","message": "Content must be between 5 and 1000 characters"},
                {"field": "blogId","message": "Blog Id must be between 6 and 30 characters"},
                {"field": "blogName","message": "Blog Name  must be between 5 and 30 characters"}
            ]
        })

        const res = await getRequest().get(RouterPaths.blogs)
        expect(res.body).toEqual([])
    })

    let createdPost:any = null;
    it(' + POST should create the post with correct data', async () => {
        const createdResponse = await getRequest()
        .post(RouterPaths.posts)
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send({ title: 'super blog', shortDescription: 'some description' , content: 'httpsxsS', blogId:'123456', blogName: 'newName'})
        .expect(HTTP_STATUSES.CREATED_201)

        createdPost = createdResponse.body;

        await getRequest()
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, [createdPost])
    })

    it('- GET post by ID with incorrect id', async () => {
        await getRequest().get(`${RouterPaths.posts}/incorrectId`).expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it('+ GET post by ID with correct id', async () => {
        await getRequest()
            .get(`${RouterPaths.posts}/${createdPost.id}`)
            .expect(200, createdPost)
    })

    it('- PUT post by ID with incorrect data', async () => {
        await getRequest()
            .put(`${RouterPaths.posts}/1234`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({ title: 'super blog', shortDescription: 'some description' , content: 'httpsxsS', blogId:'123456', blogName: 'newName'})
            .expect(HTTP_STATUSES.NOT_FOUND_404)
        
        const res = await getRequest().get(RouterPaths.posts)
        expect(res.body[0]).toEqual(createdPost)
    })

    it('+ PUT post by ID with correct data', async () => {
        await getRequest()
            .put(`${RouterPaths.posts}/${createdPost.id}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({ 
                title: 'super blog', 
                shortDescription: 'some description' , 
                content: 'httpsxsS', 
                blogId:'123456', 
                blogName: 'newName'
            })
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        const res = await getRequest().get(RouterPaths.posts)
        expect(res.body[0]).toEqual({
            ...createdPost,
                title: 'super blog', 
                shortDescription: 'some description' , 
                content: 'httpsxsS', 
                blogId:'123456', 
                blogName: 'newName'
        })
        createdPost = res.body[0]
    })

    it('- DELETE post by ID with incorrect ID', async () => {
        await getRequest()
            .delete(`${RouterPaths.posts}/1234`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        const res = await getRequest().get(RouterPaths.posts)
        expect(res.body[0]).toEqual(createdPost)
    })

    it('+ DELETE post by correct ID', async () => {
        await getRequest()
            .delete(`${RouterPaths.posts}/${createdPost.id}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        const res = await getRequest().get(RouterPaths.posts)
        expect(res.body.length).toBe(0)
    })

})

