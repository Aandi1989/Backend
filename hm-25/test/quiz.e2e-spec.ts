import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { HTTP_STATUSES, RouterPaths } from '../src/common/utils/utils';
import { applyAppSettings } from '../src/common/settings/apply-app-setting';

describe('QuizGame test (e2e)', () => {
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

      let firstQuestionId, secondQuestionId, thirdQuestionId, fourthQuestionId, fifthQuestionId, sixthQuestionId,
        firstAccessToken, secondAccessToken;
      it('+ GET should return 200 and empty array', async () => {
        const res = await request(httpServer)
          .get(`/${RouterPaths.quizQuestion}`)
          .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
          .expect(HTTP_STATUSES.OK_200)
    
          expect(res.body.items).toEqual([])
      }) 

      it('+ POST should create first question', async () => {
        const response = await request(httpServer)
            .post(`/${RouterPaths.quizQuestion}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                body: "What is the best programming language ever?",
                correctAnswers: [
                    "JavaScript", "JS"
                ]
            })
            .expect(HTTP_STATUSES.CREATED_201)
            firstQuestionId = response.body.id;          
      })

      it('+ PUT publish first question', () => {
        return request(httpServer)
            .put(`/${RouterPaths.quizQuestion}/${firstQuestionId}/publish`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                published: true
            })
            .expect(HTTP_STATUSES.NO_CONTENT_204)
      })

      it('+ POST should create second question', async () => {
        const response = await request(httpServer)
            .post(`/${RouterPaths.quizQuestion}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                body: "How many threads does JavaScript have?",
                correctAnswers: [
                    1
                ]
            })
            .expect(HTTP_STATUSES.CREATED_201)
            secondQuestionId = response.body.id;          
      })

      it('+ PUT publish second question', () => {
        return request(httpServer)
            .put(`/${RouterPaths.quizQuestion}/${secondQuestionId}/publish`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                published: true
            })
            .expect(HTTP_STATUSES.NO_CONTENT_204)
      })

      it('+ POST should create third question', async () => {
        const response = await request(httpServer)
            .post(`/${RouterPaths.quizQuestion}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                body: "What tools do we use for writing backend on JS?",
                correctAnswers: [
                    "Express", "Nest"
                ]
            })
            .expect(HTTP_STATUSES.CREATED_201)
            thirdQuestionId = response.body.id;          
      })

      it('+ PUT publish third question', () => {
        return request(httpServer)
            .put(`/${RouterPaths.quizQuestion}/${thirdQuestionId}/publish`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                published: true
            })
            .expect(HTTP_STATUSES.NO_CONTENT_204)
      })

      it('+ POST should create fourth question', async () => {
        const response = await request(httpServer)
            .post(`/${RouterPaths.quizQuestion}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                body: "What tools do we use for writing frontend on JS?",
                correctAnswers: [
                    "React", "Next"
                ]
            })
            .expect(HTTP_STATUSES.CREATED_201)
            fourthQuestionId = response.body.id;          
      })

      it('+ PUT publish fourth question', () => {
        return request(httpServer)
            .put(`/${RouterPaths.quizQuestion}/${fourthQuestionId}/publish`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                published: true
            })
            .expect(HTTP_STATUSES.NO_CONTENT_204)
      })

      it('+ POST should create fifth question', async () => {
        const response = await request(httpServer)
            .post(`/${RouterPaths.quizQuestion}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                body: "What is better React or Next?",
                correctAnswers: [
                     "Next"
                ]
            })
            .expect(HTTP_STATUSES.CREATED_201)
            fifthQuestionId = response.body.id;          
      })

      it('+ PUT publish fifth question', () => {
        return request(httpServer)
            .put(`/${RouterPaths.quizQuestion}/${fifthQuestionId}/publish`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                published: true
            })
            .expect(HTTP_STATUSES.NO_CONTENT_204)
      })

      it('+ POST should create sixth question', async () => {
        const response = await request(httpServer)
            .post(`/${RouterPaths.quizQuestion}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                body: "What is better Express or Nest?",
                correctAnswers: [
                    "Nest"
                ]
            })
            .expect(HTTP_STATUSES.CREATED_201)
            sixthQuestionId = response.body.id;          
      })

      it('+ PUT publish sixth question', () => {
        return request(httpServer)
            .put(`/${RouterPaths.quizQuestion}/${sixthQuestionId}/publish`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                published: true
            })
            .expect(HTTP_STATUSES.NO_CONTENT_204)
      })

      it('+ GET six created questions', async () => {
        const res = await request(httpServer)
        .get(`/${RouterPaths.quizQuestion}`)
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        .expect(HTTP_STATUSES.OK_200)
  
        expect(res.body.items.length).toEqual(6)
      })

      it('+ POST registration of the first user', async () => {
        return request(httpServer)
            .post(`/${RouterPaths.auth}/registration`)
            .send({
                login: "FirstUser",
                password: "123456",
                email: "firstUser@mail.com"
            })
            .expect(HTTP_STATUSES.NO_CONTENT_204)
      })

      it('+ POST login first user', async () => {
        const res = await request(httpServer)
        .post(`/${RouterPaths.auth}/login`)
        .send({
            loginOrEmail: "FirstUser",
            password: "123456"
        })
        .expect(HTTP_STATUSES.OK_200)
        firstAccessToken = res.body.accessToken
      })

      it('+ POST registration of the second user', async () => {
        return request(httpServer)
            .post(`/${RouterPaths.auth}/registration`)
            .send({
                login: "SecondUser",
                password: "123456",
                email: "secondUser@mail.com"
            })
            .expect(HTTP_STATUSES.NO_CONTENT_204)
      })

      it('+ POST login second user', async () => {
        const res = await request(httpServer)
        .post(`/${RouterPaths.auth}/login`)
        .send({
            loginOrEmail: "SecondUser",
            password: "123456"
        })
        .expect(HTTP_STATUSES.OK_200)
        secondAccessToken = res.body.accessToken
      })

      

      afterAll( async () => {
        await app.close();
      })
})

// yarn test:e2e to run all test from test folder
// yarn test:e2e quiz.e2e-spec.ts to run separate file