// import request from 'supertest';
// import { app } from '../../src/app';
// import { HTTP_STATUSES, RouterPaths } from '../../src/utils';
// import { blogsCollection } from '../../src/db/db';



// const getRequest = () => {
//     return request(app);
// }

// describe('tests for /blogs', () => {
//     beforeAll( async () => {
//         await getRequest().delete(`${RouterPaths.__test__}/all-data`)
//     })

//     it('+ GET should return 200 and empty array', async () => {
//         await getRequest()
//             .get(RouterPaths.blogs)
//             .expect(HTTP_STATUSES.OK_200, [])
//     })

//     it(' - POST should return 401 for unauthorithed user', async () => {
//         await getRequest()
//             .post(RouterPaths.blogs)
//             .set('Authorization', 'Basic invalidUserName')
//             .expect(HTTP_STATUSES.UNAUTHORIZED_401)
//     })

//     it('- POST should not create the blog with incorrect data', async () =>{
//         await getRequest()
//         .post(RouterPaths.blogs)
//         .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
//         .send({ name: '', description: 'Des' , websiteUrl: 'inavid url'})
//         .expect(HTTP_STATUSES.BAD_REQUEST_400, {
//             errorsMessages: [
//                 {"field": "name","message": "Name must be between 2 and 15 characters"},
//                 {"field": "description","message": "Description must be between 5 and 500 characters"},
//                 {"field": "websiteUrl","message": "Invalid website URL format. It should start with https:// and follow a valid URL pattern."}
//             ]
//         })

//         const res = await getRequest().get(RouterPaths.blogs)
//         expect(res.body).toEqual([])
//     })

//     let createdBlog:any = null;
//     it(' + POST should create the blog with correct data', async () => {
//         const createdResponse = await getRequest()
//         .post(RouterPaths.blogs)
//         .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
//         .send({ name: 'super blog', description: 'some description' , websiteUrl: 'https://newUrl.4HuJcxsS'})
//         .expect(HTTP_STATUSES.CREATED_201)

//         createdBlog = createdResponse.body;

//         await getRequest()
//             .get(RouterPaths.blogs)
//             .expect(HTTP_STATUSES.OK_200, [createdBlog])
//     })

//     it('- GET blog by ID with incorrect id', async () => {
//         await getRequest().get(`${RouterPaths.blogs}/incorrectId`).expect(HTTP_STATUSES.NOT_FOUND_404)
//     })

//     it('+ GET blog by ID with correct id', async () => {
//         await getRequest()
//             .get(`${RouterPaths.blogs}/${createdBlog.id}`)
//             .expect(200, createdBlog)
//     })

//     it('- PUT blog by ID with incorrect data', async () => {
//         await getRequest()
//             .put(`${RouterPaths.blogs}/1234`)
//             .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
//             .send({ name: 'title', description: 'title',  websiteUrl: 'https://MpVTNPmOhlJYNh9KkZcAO_MKaCI1bm-e6n.com'})
//             .expect(HTTP_STATUSES.NOT_FOUND_404)
        
//         const res = await getRequest().get(RouterPaths.blogs)
//         expect(res.body[0]).toEqual(createdBlog)
//     })

//     it('+ PUT video by ID with correct data', async () => {
//         await getRequest()
//             .put(`${RouterPaths.blogs}/${createdBlog.id}`)
//             .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
//             .send({
//                 name: 'new name',
//                 description: 'some description',
//                 websiteUrl: 'https://MpVTNPmOhlJYNh9KkZcAO_MKaCI1bm-e6n.com',
//             })
//             .expect(HTTP_STATUSES.NO_CONTENT_204)

//         const res = await getRequest().get(RouterPaths.blogs)
//         expect(res.body[0]).toEqual({
//             ...createdBlog,
//             name: 'new name',
//             description: 'some description',
//             websiteUrl: 'https://MpVTNPmOhlJYNh9KkZcAO_MKaCI1bm-e6n.com',
//         })
//         createdBlog = res.body[0]
//     })

//     it('- DELETE blog by ID with incorrect ID', async () => {
//         await getRequest()
//             .delete(`${RouterPaths.blogs}/1234`)
//             .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
//             .expect(HTTP_STATUSES.NOT_FOUND_404)

//         const res = await getRequest().get(RouterPaths.blogs)
//         expect(res.body[0]).toEqual(createdBlog)
//     })

//     it('+ DELETE blog by correct ID', async () => {
//         await getRequest()
//             .delete(`${RouterPaths.blogs}/${createdBlog.id}`)
//             .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
//             .expect(HTTP_STATUSES.NO_CONTENT_204)

//         const res = await getRequest().get(RouterPaths.blogs)
//         expect(res.body.length).toBe(0)
//     })
    
// })

