import request from 'supertest';
import { app } from '../../src';
import { HTTP_STATUSES } from '../../src';

describe('/course', () => {
    beforeAll( async () => {
        await request(app).delete('/__test__/data')
    })

    it('should return 200 and empty array', async () => {
      await request(app)
        .get('/courses')
        .expect(HTTP_STATUSES.OK_200, [])
    })

    it('should return 404 for not existed course', async () => {
        await request(app)
          .get('/courses/1')
          .expect(HTTP_STATUSES.NOT_FOUND_404)
      })
      
    it(`shouldn't create course with incorrect input data`,async () => {
        await request(app)
            .post('/courses')
            .send({ title: ''})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [])
    })

    let createdCourse: any = null;
    it(`should create course with correct input data`,async () => {
        const createResponse = await request(app)
            .post('/courses')
            .send({ title: 'new course'})
            .expect(HTTP_STATUSES.CREATED_201)

         createdCourse = createResponse.body;

        expect(createdCourse).toEqual({
            id: expect.any(Number),
            title: 'new course'
        })

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [createdCourse])

    })

    let createdCourse2: any = null;
    it(`create one more course`,async () => {
        const createResponse = await request(app)
            .post('/courses')
            .send({ title: 'new super course 2'})
            .expect(HTTP_STATUSES.CREATED_201)

         createdCourse2 = createResponse.body;

        expect(createdCourse2).toEqual({
            id: expect.any(Number),
            title: 'new super course 2'
        })

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [createdCourse, createdCourse2])
    })

    it(`shouldn't update course with incorrect input data`,async () => {
        await request(app)
            .put(`/courses/` + createdCourse.id)
            .send({ title: ''})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/courses/' + createdCourse.id)
            .expect(HTTP_STATUSES.OK_200, createdCourse)
    })

    it(`shouldn't update course that doesn't exists`,async () => {
        await request(app)
            .put(`/courses/` + -100)
            .send({ title: 'valid title'})
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it(`should update course with correct input data`,async () => {
        await request(app)
            .put(`/courses/` + createdCourse.id)
            .send({ title: 'valid new title'})
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get(`/courses/` + createdCourse.id)
            .expect(HTTP_STATUSES.OK_200, {
                ...createdCourse,
                title: 'valid new title'
            })
            
        await request(app)
            .get(`/courses/` + createdCourse2.id)
            .expect(HTTP_STATUSES.OK_200, createdCourse2) 
    })


    it(`should delete both courses`,async () => {
        await request(app)
            .delete(`/courses/` + createdCourse.id)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get(`/courses` + createdCourse.id)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
            
        await request(app)
            .delete(`/courses/` + createdCourse2.id)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get(`/courses` + createdCourse2.id)
            .expect(HTTP_STATUSES.NOT_FOUND_404) 

        await request(app)
        .get(`/courses`)
        .expect(HTTP_STATUSES.OK_200, [])
    })

})