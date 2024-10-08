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
        firstAccessToken, secondAccessToken, thirdAccessToken, fourthAccessToken, gameId;
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
                    "JavaScript", "JS", "Go"
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
                    // 1
                    "JS"
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
                    // "Express", "Nest"
                    "JS"
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
                    // "React", "Next"
                    "JS"
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
                    //  "Next"
                    "JS"
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
                    // "Nest"
                    "JS"
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

      it('+ POST registration of the third user', async () => {
        return request(httpServer)
            .post(`/${RouterPaths.auth}/registration`)
            .send({
                login: "ThirdUser",
                password: "123456",
                email: "thirdUser@mail.com"
            })
            .expect(HTTP_STATUSES.NO_CONTENT_204)
      })

      it('+ POST login third user', async () => {
        const res = await request(httpServer)
        .post(`/${RouterPaths.auth}/login`)
        .send({
            loginOrEmail: "ThirdUser",
            password: "123456"
        })
        .expect(HTTP_STATUSES.OK_200)
        thirdAccessToken = res.body.accessToken
      })

      it('+ POST registration of the fourth user', async () => {
        return request(httpServer)
            .post(`/${RouterPaths.auth}/registration`)
            .send({
                login: "FourthUser",
                password: "123456",
                email: "fourthUser@mail.com"
            })
            .expect(HTTP_STATUSES.NO_CONTENT_204)
      })

      it('+ POST login third user', async () => {
        const res = await request(httpServer)
        .post(`/${RouterPaths.auth}/login`)
        .send({
            loginOrEmail: "FourthUser",
            password: "123456"
        })
        .expect(HTTP_STATUSES.OK_200)
        fourthAccessToken = res.body.accessToken
      })

      // first game ==============================================
      // first user wins 3 - 2
      // it(' + POST create game by the first user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/connection`)
      //   .set('Authorization', `Basic ${firstAccessToken}`)
      //   .expect(HTTP_STATUSES.OK_200)
      //   gameId = res.body.id;
      // })

      // it(' - POST double create game by the first user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/connection`)
      //   .set('Authorization', `Basic ${firstAccessToken}`)
      //   .expect(HTTP_STATUSES.ACCESS_FORBIDDEN_403)
      // })

      // it(' + POST participate game by the second user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/connection`)
      //   .set('Authorization', `Basic ${secondAccessToken}`)
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      
      // it(' - POST double participate game by the second user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/connection`)
      //   .set('Authorization', `Basic ${secondAccessToken}`)
      //   .expect(HTTP_STATUSES.ACCESS_FORBIDDEN_403)
      // })

      // it(' + GET game by id first user', async () => {
      //   const res = await request(httpServer)
      //   .get(`/${RouterPaths.pairGame}/pairs/${gameId}`)
      //   .set('Authorization', `Bearer ${firstAccessToken}`)
      //   .expect(HTTP_STATUSES.OK_200)
      //   console.log("game by id of first user --->", res.body)
      // })

      // it(' + GET game by id second user', async () => {
      //   const res = await request(httpServer)
      //   .get(`/${RouterPaths.pairGame}/pairs/${gameId}`)
      //   .set('Authorization', `Bearer ${secondAccessToken}`)
      //   .expect(HTTP_STATUSES.OK_200)
      //   console.log("game by id of second user --->", res.body)

      // })

      
      // it(' + GET current game by first user', async () => {
      //   const res = await request(httpServer)
      //   .get(`/${RouterPaths.pairGame}/pairs/my-current`)
      //   .set('Authorization', `Bearer ${firstAccessToken}`)
      //   .expect(HTTP_STATUSES.OK_200)
      //   console.log("current game of first user --->", res.body)
      // })

      // it(' + GET current game by second user', async () => {
      //   const res = await request(httpServer)
      //   .get(`/${RouterPaths.pairGame}/pairs/my-current`)
      //   .set('Authorization', `Bearer ${secondAccessToken}`)
      //   .expect(HTTP_STATUSES.OK_200)
      //   console.log("current game of second user --->", res.body)
      // })

      // it(' + POST send first answer by the first user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${firstAccessToken}`)
      //   .send({
      //     answer: "JS"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + GET current game by first user', async () => {
      //   const res = await request(httpServer)
      //   .get(`/${RouterPaths.pairGame}/pairs/my-current`)
      //   .set('Authorization', `Bearer ${firstAccessToken}`)
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      //  it(' + POST send first answer by the second user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${secondAccessToken}`)
      //   .send({
      //     answer: "Wrong answer"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + GET current game by second user', async () => {
      //   const res = await request(httpServer)
      //   .get(`/${RouterPaths.pairGame}/pairs/my-current`)
      //   .set('Authorization', `Bearer ${secondAccessToken}`)
      //   .expect(HTTP_STATUSES.OK_200)
        // console.log("current game of second user after first answer--->", res.body)
      // })

      // it(' + POST send second answer by the second user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${secondAccessToken}`)
      //   .send({
      //     answer: "JS"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + GET current game by second user', async () => {
      //   const res = await request(httpServer)
      //   .get(`/${RouterPaths.pairGame}/pairs/my-current`)
      //   .set('Authorization', `Bearer ${secondAccessToken}`)
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' - POST send first answer by the third user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${thirdAccessToken}`)
      //   .send({
      //     answer: "JS"
      //   })
      //   .expect(HTTP_STATUSES.ACCESS_FORBIDDEN_403)
      // })


     // continuation of first game =======================================
      // it(' + POST send first answer by the first user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${firstAccessToken}`)
      //   .send({
      //     answer: "JS"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })


      // it(' + POST send second answer by the first user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${firstAccessToken}`)
      //   .send({
      //     answer: "Wrong answer"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send first answer by the second user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${secondAccessToken}`)
      //   .send({
      //     answer: "JS"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send second answer by the second user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${secondAccessToken}`)
      //   .send({
      //     answer: "wrong answer"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send third answer by the second user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${secondAccessToken}`)
      //   .send({
      //     answer: "wrong answer"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send fourth answer by the second user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${secondAccessToken}`)
      //   .send({
      //     answer: "wrong answer"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send fifth answer by the second user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${secondAccessToken}`)
      //   .send({
      //     answer: "wrong answer"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // }, 15000)

      // it(' + POST send third answer by the first user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${firstAccessToken}`)
      //   .send({
      //     answer: "JS"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send fourth answer by the first user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${firstAccessToken}`)
      //   .send({
      //     answer: "JS"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send fifth answer by the first user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${firstAccessToken}`)
      //   .send({
      //     answer: "wrong answer"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      //second game ===========================================
      // first user wins 3 - 2

      // it(' + POST create game by the user2', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/connection`)
      //   .set('Authorization', `Basic ${secondAccessToken}`)
      //   .expect(HTTP_STATUSES.OK_200)
      //   gameId = res.body.id;
      // })


      // it(' + POST participate game by the user1', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/connection`)
      //   .set('Authorization', `Basic ${firstAccessToken}`)
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send first answer by the first user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${secondAccessToken}`)
      //   .send({
      //     answer: "JS"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })


      // it(' + POST send second answer by the first user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${secondAccessToken}`)
      //   .send({
      //     answer: "Wrong answer"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send first answer by the second user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${firstAccessToken}`)
      //   .send({
      //     answer: "JS"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send second answer by the second user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${firstAccessToken}`)
      //   .send({
      //     answer: "wrong answer"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send third answer by the second user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${firstAccessToken}`)
      //   .send({
      //     answer: "wrong answer"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send fourth answer by the second user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${firstAccessToken}`)
      //   .send({
      //     answer: "wrong answer"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send fifth answer by the second user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${firstAccessToken}`)
      //   .send({
      //     answer: "wrong answer"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send third answer by the first user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${secondAccessToken}`)
      //   .send({
      //     answer: "JS"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send fourth answer by the first user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${secondAccessToken}`)
      //   .send({
      //     answer: "JS"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send fifth answer by the first user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${secondAccessToken}`)
      //   .send({
      //     answer: "wrong answer"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      //third game=========================================
      // first user wins 3 - 2
      // it(' + POST create game by the first user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/connection`)
      //   .set('Authorization', `Basic ${firstAccessToken}`)
      //   .expect(HTTP_STATUSES.OK_200)
      //   gameId = res.body.id;
      // })

      // it(' + POST participate game by the second user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/connection`)
      //   .set('Authorization', `Basic ${secondAccessToken}`)
      //   .expect(HTTP_STATUSES.OK_200)
      // })
      
      // it(' + POST send first answer by the first user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${firstAccessToken}`)
      //   .send({
      //     answer: "JS"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send second answer by the first user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${firstAccessToken}`)
      //   .send({
      //     answer: "Wrong answer"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send first answer by the second user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${secondAccessToken}`)
      //   .send({
      //     answer: "JS"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send second answer by the second user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${secondAccessToken}`)
      //   .send({
      //     answer: "wrong answer"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send third answer by the second user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${secondAccessToken}`)
      //   .send({
      //     answer: "wrong answer"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send fourth answer by the second user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${secondAccessToken}`)
      //   .send({
      //     answer: "wrong answer"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send fifth answer by the second user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${secondAccessToken}`)
      //   .send({
      //     answer: "wrong answer"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send third answer by the first user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${firstAccessToken}`)
      //   .send({
      //     answer: "JS"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send fourth answer by the first user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${firstAccessToken}`)
      //   .send({
      //     answer: "JS"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send fifth answer by the first user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${firstAccessToken}`)
      //   .send({
      //     answer: "wrong answer"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // fourth game ============================================
      // 3-2 wins first player

      // it(' + POST create game by the user2', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/connection`)
      //   .set('Authorization', `Basic ${secondAccessToken}`)
      //   .expect(HTTP_STATUSES.OK_200)
      //   gameId = res.body.id;
      // })


      // it(' + POST participate game by the user1', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/connection`)
      //   .set('Authorization', `Basic ${firstAccessToken}`)
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send first answer by the first user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${secondAccessToken}`)
      //   .send({
      //     answer: "JS"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })


      // it(' + POST send second answer by the first user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${secondAccessToken}`)
      //   .send({
      //     answer: "Wrong answer"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send first answer by the second user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${firstAccessToken}`)
      //   .send({
      //     answer: "JS"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send second answer by the second user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${firstAccessToken}`)
      //   .send({
      //     answer: "wrong answer"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send third answer by the second user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${firstAccessToken}`)
      //   .send({
      //     answer: "wrong answer"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send fourth answer by the second user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${firstAccessToken}`)
      //   .send({
      //     answer: "wrong answer"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send fifth answer by the second user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${firstAccessToken}`)
      //   .send({
      //     answer: "wrong answer"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send third answer by the first user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${secondAccessToken}`)
      //   .send({
      //     answer: "JS"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send fourth answer by the first user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${secondAccessToken}`)
      //   .send({
      //     answer: "JS"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send fifth answer by the first user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${secondAccessToken}`)
      //   .send({
      //     answer: "wrong answer"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // fifth game=======================
      // 2- 2
      // it(' + POST create game by the user1', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/connection`)
      //   .set('Authorization', `Basic ${firstAccessToken}`)
      //   .expect(HTTP_STATUSES.OK_200)
      //   gameId = res.body.id;
      // })


      // it(' + POST participate game by the user3', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/connection`)
      //   .set('Authorization', `Basic ${thirdAccessToken}`)
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send first answer by the first user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${firstAccessToken}`)
      //   .send({
      //     answer: "JS"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send second answer by the first user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${firstAccessToken}`)
      //   .send({
      //     answer: "wrong"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send first answer by the second user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${thirdAccessToken}`)
      //   .send({
      //     answer: "JS"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send second answer by the second user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${thirdAccessToken}`)
      //   .send({
      //     answer: "wrong"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send third answer by the second user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${thirdAccessToken}`)
      //   .send({
      //     answer: "wrong"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send fourth answer by the second user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${thirdAccessToken}`)
      //   .send({
      //     answer: "wrong"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send fifth answer by the second user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${thirdAccessToken}`)
      //   .send({
      //     answer: "wrong"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send third answer by the first user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${firstAccessToken}`)
      //   .send({
      //     answer: "JS"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send fourth answer by the first user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${firstAccessToken}`)
      //   .send({
      //     answer: "wrong"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send fifth answer by the first user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${firstAccessToken}`)
      //   .send({
      //     answer: "wrong"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })


      // sixth game =================================
      // 5 - 0

      // it(' + POST create game by the user1', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/connection`)
      //   .set('Authorization', `Basic ${firstAccessToken}`)
      //   .expect(HTTP_STATUSES.OK_200)
      //   gameId = res.body.id;
      // })


      // it(' + POST participate game by the user4', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/connection`)
      //   .set('Authorization', `Basic ${fourthAccessToken}`)
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send first answer by the second user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${fourthAccessToken}`)
      //   .send({
      //     answer: "JS"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send second answer by the second user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${fourthAccessToken}`)
      //   .send({
      //     answer: "JS"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send first answer by the first user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${firstAccessToken}`)
      //   .send({
      //     answer: "wrong"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send third answer by the second user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${fourthAccessToken}`)
      //   .send({
      //     answer: "JS"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send fourth answer by the second user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${fourthAccessToken}`)
      //   .send({
      //     answer: "JS"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send second answer by the first user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${firstAccessToken}`)
      //   .send({
      //     answer: "wrong"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send third answer by the first user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${firstAccessToken}`)
      //   .send({
      //     answer: "wrong"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send fourh answer by the first user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${firstAccessToken}`)
      //   .send({
      //     answer: "wrong"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })


      // it(' + POST send fifth answer by the second user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${fourthAccessToken}`)
      //   .send({
      //     answer: "JS"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })


      // it(' + POST send fifth answer by the first user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${firstAccessToken}`)
      //   .send({
      //     answer: "wrong"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      

      // seventh game ==========================================================
      // 5 - 0 

      // it(' + POST create game by the user1', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/connection`)
      //   .set('Authorization', `Basic ${fourthAccessToken}`)
      //   .expect(HTTP_STATUSES.OK_200)
      //   gameId = res.body.id;
      // })


      // it(' + POST participate game by the user4', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/connection`)
      //   .set('Authorization', `Basic ${firstAccessToken}`)
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send first answer by the second user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${firstAccessToken}`)
      //   .send({
      //     answer: "JS"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send second answer by the second user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${firstAccessToken}`)
      //   .send({
      //     answer: "JS"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send first answer by the first user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${fourthAccessToken}`)
      //   .send({
      //     answer: "wrong"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send third answer by the second user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${firstAccessToken}`)
      //   .send({
      //     answer: "JS"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send fourth answer by the second user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${firstAccessToken}`)
      //   .send({
      //     answer: "JS"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send second answer by the first user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${fourthAccessToken}`)
      //   .send({
      //     answer: "wrong"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send third answer by the first user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${fourthAccessToken}`)
      //   .send({
      //     answer: "wrong"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send fourh answer by the first user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${fourthAccessToken}`)
      //   .send({
      //     answer: "wrong"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send fifth answer by the first user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${fourthAccessToken}`)
      //   .send({
      //     answer: "wrong"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send fifth answer by the second user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${firstAccessToken}`)
      //   .send({
      //     answer: "JS"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // =============================================================

      // eighth game 
      // 3 - 2
      // it(' + POST create game by the first user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/connection`)
      //   .set('Authorization', `Basic ${secondAccessToken}`)
      //   .expect(HTTP_STATUSES.OK_200)
      //   gameId = res.body.id;
      // })

      // it(' + POST participate game by the second user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/connection`)
      //   .set('Authorization', `Basic ${fourthAccessToken}`)
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send first answer by the first user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${secondAccessToken}`)
      //   .send({
      //     answer: "JS"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })


      // it(' + POST send second answer by the first user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${secondAccessToken}`)
      //   .send({
      //     answer: "Wrong answer"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send first answer by the second user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${fourthAccessToken}`)
      //   .send({
      //     answer: "JS"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send second answer by the second user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${fourthAccessToken}`)
      //   .send({
      //     answer: "wrong answer"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send third answer by the second user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${fourthAccessToken}`)
      //   .send({
      //     answer: "wrong answer"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send fourth answer by the second user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${fourthAccessToken}`)
      //   .send({
      //     answer: "wrong answer"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send fifth answer by the second user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${fourthAccessToken}`)
      //   .send({
      //     answer: "wrong answer"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send third answer by the first user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${secondAccessToken}`)
      //   .send({
      //     answer: "JS"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send fourth answer by the first user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${secondAccessToken}`)
      //   .send({
      //     answer: "JS"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // it(' + POST send fifth answer by the first user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.pairGame}/pairs/my-current/answers`)
      //   .set('Authorization', `Basic ${secondAccessToken}`)
      //   .send({
      //     answer: "wrong answer"
      //   })
      //   .expect(HTTP_STATUSES.OK_200)
      // })

      // =====================================================


      afterAll( async () => {
        console.log("firstAccessToken-->", firstAccessToken);
        console.log("secondAccessToken-->", secondAccessToken);
        console.log("thirdAccessToken-->", thirdAccessToken);
        console.log("fourthAccessToken-->", fourthAccessToken);
        await app.close();
      })
})

// yarn test:e2e to run all test from test folder
// yarn test:e2e quiz.e2e-spec.ts to run separate file