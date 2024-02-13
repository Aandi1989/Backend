import request from 'supertest';
import {app} from '../../src/app';
import { CreateCourseModel } from '../../src/features/courses/models/CreateCourseModel';
import { UpdateCourseModel } from '../../src/features/courses/models/UpdateCourseModel';
import { HTTP_STATUSES } from '../../src/utils';

const getRequest = () => {
    return request(app)
}

describe('/course', () => {
    beforeAll( async () => {
        await getRequest().delete('/__test__/data')
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
        const data: CreateCourseModel ={ title: '' }
        
        await request(app)
            .post('/courses')
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [])
    })

    let createdCourse: any = null;
    it(`should create course with correct input data`,async () => {
        const data: CreateCourseModel ={ title: 'new course' }
        
        const createResponse = await request(app)
            .post('/courses')
            .send(data)
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
        const data: CreateCourseModel ={ title: 'new super course 2' }
        
        const createResponse = await request(app)
            .post('/courses')
            .send(data)
            .expect(HTTP_STATUSES.CREATED_201)

         createdCourse2 = createResponse.body;

        expect(createdCourse2).toEqual({
            id: expect.any(Number),
            title: data.title
        })

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [createdCourse, createdCourse2])
    })

    it(`shouldn't update course with incorrect input data`,async () => {
        const data: CreateCourseModel ={ title: '' }
       
        await request(app)
            .put(`/courses/` + createdCourse.id)
            .send(data)
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
        const data: UpdateCourseModel ={ title: 'valid new title' }
        
        await request(app)
            .put(`/courses/` + createdCourse.id)
            .send(data)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get(`/courses/` + createdCourse.id)
            .expect(HTTP_STATUSES.OK_200, {
                ...createdCourse,
                title: data.title
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

    afterAll(done => {
        done()
    })
})