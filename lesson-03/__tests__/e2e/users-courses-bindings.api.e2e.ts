import request from 'supertest';
import { RouterPaths, app } from '../../src/app';
import { CreateUserModel } from '../../src/features/users/models/CreateUserModel';
import { HTTP_STATUSES } from '../../src/utils';
import { usersTestManager } from '../utils/usersTestManager';
import { usersCoursesBindingsTestManager } from '../utils/usersCoursesBindingsTestManager';
import { CreateUserCourseBindingModel } from '../../src/features/users-courses-bindings/models/CreateUserCourseBindingModel';
import { coursesTestManager } from '../utils/coursesTestManager';


const getRequest = () => {
    return request(app)
}

describe('test for /users-courses-bindings', () => {
    beforeEach( async () => {
        await getRequest().delete(`${RouterPaths.__test__}/data`)
    })

      
    it(`should create entity with correct input data`,async () => {
        const createUserResult = await usersTestManager.createUser({userName: 'dimych'}); 
        const createCourseResult = await coursesTestManager.createCourse({title: 'front-end'}); 

        const data: CreateUserCourseBindingModel = { 
            userId: createUserResult.createdEntity.id, 
            courseId:createCourseResult.createdEntity.id 
        }
        
        await usersCoursesBindingsTestManager.createBinding(data)
    })


    it(`shouldn't create course binding because courseBinding is already exist`,async () => {
        const createUserResult = await usersTestManager.createUser({userName: 'dimych'}); 
        const createCourseResult = await coursesTestManager.createCourse({title: 'front-end'}); 

        const data: CreateUserCourseBindingModel = { 
            userId: createUserResult.createdEntity.id, 
            courseId:createCourseResult.createdEntity.id 
        }
        
        await usersCoursesBindingsTestManager.createBinding(data)
        
        await usersCoursesBindingsTestManager.createBinding(data, HTTP_STATUSES.BAD_REQUEST_400)
    })

    

    afterAll(done => {
        done()
    })
})