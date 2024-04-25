import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { HTTP_STATUSES, RouterPaths } from '../src/common/utils/utils';
import { applyAppSettings } from '../src/common/settings/apply-app-setting';
import { Repository } from 'typeorm';
import { User } from '../src/features/users/domain/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('Auth flow (e2e)', () => {
    let app: INestApplication;
    let httpServer;
    let usersRepository: Repository<User>;
  
    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();
  
      app = moduleFixture.createNestApplication();
  
      applyAppSettings(app)
  
      await app.init();
  
      httpServer = app.getHttpServer();

      usersRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
  
      return request(httpServer)
        .delete(`/${RouterPaths.testingAllData}`)
    });
  
    it('- POST failed registration with incorrect input', async () => {
      const res = await request(httpServer)
        .post(`/${RouterPaths.auth}/registration`)
        .send({
            email: "cat2021gmail.com",
            login: "Fa",
            password: "12345"
        })
        .expect(HTTP_STATUSES.BAD_REQUEST_400, {
            "errorsMessages": [
                { "message": "login must be longer than or equal to 3 characters", "field": "login"},
                { "message": "password must be longer than or equal to 6 characters", "field": "password"},
                { "message": "email must be an email", "field": "email"}]
        })
    })
  
   it('+ POST successful registration', async () => {
     return request(httpServer)
        .post(`/${RouterPaths.auth}/registration`)
        .send({
            email: "cat2021@gmail.com",
            login: "Fabi",
            password:"123456"
        })
        .expect(HTTP_STATUSES.NO_CONTENT_204)
   })

   let createdUser:any = null;
   let updatedConfirmCodeUser:any = null;
   let confirmationCode: any = null;
   let newConfirmationCode: any = null;
   it('+ POST successful email-resending', async () => {
    const res = await request(httpServer)
        .get(`/${RouterPaths.usersSA}`)
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .expect(HTTP_STATUSES.OK_200)
    
        const newUser = await usersRepository.findOneBy({email: 'cat2021@gmail.com'})

        createdUser = res.body.items[0];
        confirmationCode = createdUser.confirmationCode;


    const postRes = await request(httpServer)
        .post(`/${RouterPaths.auth}/registration-email-resending`)
        .send({email: `${createdUser.email}`})
        .expect(HTTP_STATUSES.NO_CONTENT_204)

    const secondRes = await request(httpServer)
        .get(`/${RouterPaths.usersSA}`)
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .expect(HTTP_STATUSES.OK_200)   
        
        updatedConfirmCodeUser = secondRes.body.items[0];
        newConfirmationCode = updatedConfirmCodeUser.confirmationCode

        expect(confirmationCode).not.toEqual(newConfirmationCode)
   })

  
    afterAll( async () => {
      await app.close();
    })
  });
  

  // yarn test:e2e auth.int-spec.ts ---command to run this file
  