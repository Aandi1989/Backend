import request from 'supertest';
import { RouterPaths, app } from '../../src/app';
import { CreateUserModel } from '../../src/features/users/models/CreateUserModel';
import { HTTP_STATUSES } from '../../src/utils';
import { usersTestManager } from '../utils/usersTestManager';


const getRequest = () => {
    return request(app)
}

describe('test for /users', () => {
    beforeAll( async () => {
        await getRequest().delete(`${RouterPaths.__test__}/data`)
    })

    it('should return 200 and empty array', async () => {
      await request(app)
        .get(RouterPaths.users)
        .expect(HTTP_STATUSES.OK_200, [])
    })

    it('should return 404 for not existed entity', async () => {
        await request(app)
          .get(`${RouterPaths.users}/1`)
          .expect(HTTP_STATUSES.NOT_FOUND_404)
      })
      
    it(`shouldn't create entity with incorrect input data`,async () => {
        const data: CreateUserModel ={ userName: '' }
        
        await usersTestManager.createUser(data, HTTP_STATUSES.BAD_REQUEST_400)
        
        await request(app)
            .get(RouterPaths.users)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    let createdEntity1: any = null;
    it(`should create entity with correct input data`,async () => {
        const data: CreateUserModel ={ userName: 'dimych' }
        
        const { createdEntity } = await usersTestManager.createUser(data)

        createdEntity1 = createdEntity;
        
        await request(app)
            .get(RouterPaths.users)
            .expect(HTTP_STATUSES.OK_200, [createdEntity1])

    })

    let createdEntity2: any = null;
    it(`create one more entity`,async () => {
        const data: CreateUserModel ={ userName: 'ivan' }
        
        const {createdEntity} = await usersTestManager.createUser(data)

        createdEntity2 = createdEntity;
        
        await request(app)
            .get(RouterPaths.users)
            .expect(HTTP_STATUSES.OK_200, [createdEntity1, createdEntity2])
    })

    it(`shouldn't update entity with incorrect input data`,async () => {
        const data: CreateUserModel ={ userName: '' }
       
        await request(app)
            .put(`${RouterPaths.users}/${createdEntity1.id}`)
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(`${RouterPaths.users}/${createdEntity1.id}`)
            .expect(HTTP_STATUSES.OK_200, createdEntity1)
    })

    it(`shouldn't update entity that doesn't exists`,async () => {
        await request(app)
            .put(`${RouterPaths.users}/${-100}`)
            .send({ userName: 'Andrei'})
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it(`should update entity with correct input data`,async () => {
        const data: CreateUserModel ={ userName: 'DIMYCH' }
        
        await request(app)
            .put(`${RouterPaths.users}/${createdEntity1.id}`)
            .send(data)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get(`${RouterPaths.users}/${createdEntity1.id}`)
            .expect(HTTP_STATUSES.OK_200, {
                ...createdEntity1,
                userName: data.userName
            })
            
        await request(app)
            .get(`${RouterPaths.users}/${createdEntity2.id}`)
            .expect(HTTP_STATUSES.OK_200, createdEntity2) 
    })


    it(`should delete both entities`,async () => {
        await request(app)
            .delete(`${RouterPaths.users}/${createdEntity1.id}`)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get(`${RouterPaths.users}/${createdEntity1.id}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
            
        await request(app)
            .delete(`${RouterPaths.users}/${createdEntity2.id}`)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get(`${RouterPaths.users}/${createdEntity2.id}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404) 

        await request(app)
        .get(RouterPaths.users)
        .expect(HTTP_STATUSES.OK_200, [])
    })

    afterAll(done => {
        done()
    })
})