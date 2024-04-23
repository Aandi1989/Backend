import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should create a new user', () => {
    return request(app.getHttpServer())
        .post('/sa/users')
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .send({
            login:"Jonny",
            password: "123456",
            email:"master2021@gmail.com"
        })
        .expect(201)
  }) 
});
