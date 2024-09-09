import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { HTTP_STATUSES, RouterPaths } from '../src/common/utils/utils';
import { applyAppSettings } from '../src/common/settings/apply-app-setting';

describe('Users SuperAdmin (e2e)', () => {
  let app: INestApplication;
  let httpServer;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    applyAppSettings(app)

    await app.init();

    httpServer = app.getHttpServer();

    return request(httpServer)
      .delete(`/${RouterPaths.testingAllData}`)
  });

  it('+ GET should return 200 and empty array', async () => {
    const res = await request(httpServer)
      .get(`/${RouterPaths.users}`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .expect(HTTP_STATUSES.OK_200)

      expect(res.body.items).toEqual([])
  })

  it(' - POST should not create a new user because of wrong basic authorization', () => {
    return request(httpServer)
        .post(`/${RouterPaths.users}`)
        .set('Authorization', 'Basic invalidAuth')
        .send({
            login:"TestUser",
            password: "123456",
            email:"testUser2021@gmail.com"
        })
        .expect(HTTP_STATUSES.UNAUTHORIZED_401)
  }) 

  it(' - POST should not create a new user because of incorrect input', () => {
    return request(httpServer)
        .post(`/${RouterPaths.users}`)
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send({
            login:"Te",
            password: "12345",
            email:"testUser2021mail"
        })
        .expect(HTTP_STATUSES.BAD_REQUEST_400, {
          "errorsMessages": [
            {"message": "login must be longer than or equal to 3 characters","field": "login"},
            {"message": "password must be longer than or equal to 6 characters","field": "password"},
            {"message": "email must be an email", "field": "email"}]
      })
  }) 

  let createdUser:any = null;
  it(' + POST should create a new user', async () => {
    const response = await request(httpServer)
        .post(`/${RouterPaths.users}`)
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send({
            login:"TestUser",
            password: "123456",
            email:"testUser2021@gmail.com"
        })
        .expect(HTTP_STATUSES.CREATED_201)

        createdUser = response.body;
  }) 

  it('- DELETE should not delete user by unathorithed', async () => {
    return request(httpServer)
      .delete(`/${RouterPaths.users}/12345`)
      .set('Authorization', 'Basic wrongAoth')
      .expect(HTTP_STATUSES.UNAUTHORIZED_401)
  })

  it('- DELETE should not delete user with incorrect id', async () => {
    return request(httpServer)
      .delete(`/${RouterPaths.users}/b9fc0872-5a32-4628-b9ee-9d9b3aebce4a`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .expect(HTTP_STATUSES.NOT_FOUND_404)
  })

  it('+ DELETE should delete user with correct id', async () => {
    return request(httpServer)
      .delete(`/${RouterPaths.users}/${createdUser.id}`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .expect(HTTP_STATUSES.NO_CONTENT_204);
  })

  it('+ GET should return 200 and empty array', async () => {
    const res = await request(httpServer)
      .get(`/${RouterPaths.users}`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .expect(HTTP_STATUSES.OK_200)

      expect(res.body.items).toEqual([])
  })

  it(' + POST create multiple users', async () => {
    for(let i =1; i <= 12; i++){
      await request(httpServer)
        .post(`/${RouterPaths.users}`)
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send({
            login: `TestUser${i}`,
            password: '123456',
            email: `testUser${i}@gmail.com`
        })
        .expect(HTTP_STATUSES.CREATED_201)
    }
  }, 10000)

  it('+ GET users correct pagination without query params', async () => {
    const res = await request(httpServer)
      .get(`/${RouterPaths.users}`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .expect(HTTP_STATUSES.OK_200)

      expect(res.body).toEqual({
        "pagesCount": 2,
        "page": 1,
        "pageSize": 10,
        "totalCount": 12,
        "items": expect.arrayContaining([
          expect.objectContaining
            ({
                "id":  expect.any(String),
                "login": "TestUser12",
                "email": "testUser12@gmail.com",
                "createdAt": expect.any(String)
            }),
            expect.objectContaining
            ({
                "id":  expect.any(String),
                "login": "TestUser11",
                "email": "testUser11@gmail.com",
                "createdAt": expect.any(String)
            }), 
            expect.objectContaining
            ({
                "id":  expect.any(String),
                "login": "TestUser10",
                "email": "testUser10@gmail.com",
                "createdAt": expect.any(String)
            }),
            expect.objectContaining
            ({
                "id":  expect.any(String),
                "login": "TestUser9",
                "email": "testUser9@gmail.com",
                "createdAt": expect.any(String)
            }),
            expect.objectContaining
            ({
                "id":  expect.any(String),
                "login": "TestUser8",
                "email": "testUser8@gmail.com",
                "createdAt": expect.any(String)
            }),
            expect.objectContaining
            ({
                "id":  expect.any(String),
                "login": "TestUser7",
                "email": "testUser7@gmail.com",
                "createdAt": expect.any(String)
            }),
            expect.objectContaining
            ({
                "id":  expect.any(String),
                "login": "TestUser6",
                "email": "testUser6@gmail.com",
                "createdAt": expect.any(String)
            }),
            expect.objectContaining
            ({
                "id":  expect.any(String),
                "login": "TestUser5",
                "email": "testUser5@gmail.com",
                "createdAt": expect.any(String)
            }),
            expect.objectContaining
            ({
                "id":  expect.any(String),
                "login": "TestUser4",
                "email": "testUser4@gmail.com",
                "createdAt": expect.any(String)
            }),
            expect.objectContaining
            ({
                "id":  expect.any(String),
                "login": "TestUser3",
                "email": "testUser3@gmail.com",
                "createdAt": expect.any(String)
            }),
        ])
    })
  })

  it('+ GET users correct pagination with query params', async () => {
    const res = await request(httpServer)
      .get(`/${RouterPaths.users}/?pageSize=4&pageNumber=2`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .expect(HTTP_STATUSES.OK_200)

      expect(res.body).toEqual({
        "pagesCount": 3,
        "page": 2,
        "pageSize": 4,
        "totalCount": 12,
        "items": expect.arrayContaining([
          expect.objectContaining
            ({
                "id": expect.any(String),
                "login": "TestUser8",
                "email": "testUser8@gmail.com",
                "createdAt": expect.any(String)
            }),
          expect.objectContaining
            ({
                "id": expect.any(String),
                "login": "TestUser7",
                "email": "testUser7@gmail.com",
                "createdAt": expect.any(String)
            }),
          expect.objectContaining
            ({
                "id": expect.any(String),
                "login": "TestUser6",
                "email": "testUser6@gmail.com",
                "createdAt": expect.any(String)
            }),
          expect.objectContaining
            ({
                "id": expect.any(String),
                "login": "TestUser5",
                "email": "testUser5@gmail.com",
                "createdAt": expect.any(String)
            })
        ])
    })
  })

  it('+ GET users correct sorting by createdAt ASC', async () => {
    const res = await request(httpServer)
      .get(`/${RouterPaths.users}/?sortedBy=createdAt&sortDirection=asc`)
      .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
      .expect(HTTP_STATUSES.OK_200)

      expect(res.body).toEqual({
        "pagesCount": 2,
        "page": 1,
        "pageSize": 10,
        "totalCount": 12,
        "items": expect.arrayContaining([
          expect.objectContaining
            ({
                "id":  expect.any(String),
                "login": "TestUser1",
                "email": "testUser1@gmail.com",
                "createdAt": expect.any(String)
            }),
            expect.objectContaining
            ({
                "id":  expect.any(String),
                "login": "TestUser2",
                "email": "testUser2@gmail.com",
                "createdAt": expect.any(String)
            }), 
            expect.objectContaining
            ({
                "id":  expect.any(String),
                "login": "TestUser3",
                "email": "testUser3@gmail.com",
                "createdAt": expect.any(String)
            }),
            expect.objectContaining
            ({
                "id":  expect.any(String),
                "login": "TestUser4",
                "email": "testUser4@gmail.com",
                "createdAt": expect.any(String)
            }),
            expect.objectContaining
            ({
                "id":  expect.any(String),
                "login": "TestUser5",
                "email": "testUser5@gmail.com",
                "createdAt": expect.any(String)
            }),
            expect.objectContaining
            ({
                "id":  expect.any(String),
                "login": "TestUser6",
                "email": "testUser6@gmail.com",
                "createdAt": expect.any(String)
            }),
            expect.objectContaining
            ({
                "id":  expect.any(String),
                "login": "TestUser7",
                "email": "testUser7@gmail.com",
                "createdAt": expect.any(String)
            }),
            expect.objectContaining
            ({
                "id":  expect.any(String),
                "login": "TestUser8",
                "email": "testUser8@gmail.com",
                "createdAt": expect.any(String)
            }),
            expect.objectContaining
            ({
                "id":  expect.any(String),
                "login": "TestUser9",
                "email": "testUser9@gmail.com",
                "createdAt": expect.any(String)
            }),
            expect.objectContaining
            ({
                "id":  expect.any(String),
                "login": "TestUser10",
                "email": "testUser10@gmail.com",
                "createdAt": expect.any(String)
            }),
        ])
    })
  })

  afterAll( async () => {
    await app.close();
  })
});

// yarn test:e2e to run all test from test folder
// yarn test:e2e users.e2e-spec.ts to run separate file

// describe('User Management E2E Tests', () => {
//   let app: INestApplication;

//   beforeAll(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();

//     app = moduleFixture.createNestApplication();
//     await app.init();
//   });

//   describe('User Creation', () => {
//     it('should create a new user', async () => {
//       await request(app.getHttpServer())
//         .post('/users')
//         .send({ username: 'testuser', password: 'testpass' })
//         .expect(201);
//     });

//     it('should reject duplicate username', async () => {
//       await request(app.getHttpServer())
//         .post('/users')
//         .send({ username: 'testuser', password: 'testpass' })
//         .expect(409); // Assuming 409 Conflict for duplicates
//     });
//   });

//   describe('User Retrieval', () => {
//     it('should get the list of users', async () => {
//       const response = await request(app.getHttpServer()).get('/users');
//       expect(response.status).toBe(200);
//       expect(response.body).toContainEqual(expect.objectContaining({ username: 'testuser' }));
//     });
//   });

//   afterAll(async () => {
//     await app.close();
//   });

// });


