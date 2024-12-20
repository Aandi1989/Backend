import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { HTTP_STATUSES, RouterPaths } from '../src/common/utils/utils';
import { applyAppSettings } from '../src/common/settings/apply-app-setting';

describe('hm-30 test (e2e)', () => {
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

      let firstAccessToken, secondAccessToken, thirdAccessToken, fourthAccessToken, fifthAccessToken,
        firstUserFirstBlogId, firstUserSecondBlogId, firstUserThirdBlogId, firstUserFourthBlogId,
        firstUserFifthBlogId, firstUserSixthBlogId
        
      it('+ GET should return 200 and empty array', async () => {
        const res = await request(httpServer)
          .get(`/${RouterPaths.quizQuestion}`)
          .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
          .expect(HTTP_STATUSES.OK_200)
    
          expect(res.body.items).toEqual([])
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

    //   it('+ POST registration of the fourth user', async () => {
    //     return request(httpServer)
    //         .post(`/${RouterPaths.auth}/registration`)
    //         .send({
    //             login: "FourthUser",
    //             password: "123456",
    //             email: "fourthUser@mail.com"
    //         })
    //         .expect(HTTP_STATUSES.NO_CONTENT_204)
    //   })

    //   it('+ POST login fourth user', async () => {
    //     const res = await request(httpServer)
    //     .post(`/${RouterPaths.auth}/login`)
    //     .send({
    //         loginOrEmail: "FourthUser",
    //         password: "123456"
    //     })
    //     .expect(HTTP_STATUSES.OK_200)
    //     fourthAccessToken = res.body.accessToken
    //   })

    //   it('+ POST registration of the fifth user', async () => {
    //     return request(httpServer)
    //         .post(`/${RouterPaths.auth}/registration`)
    //         .send({
    //             login: "FifthUser",
    //             password: "123456",
    //             email: "fifthUser@mail.com"
    //         })
    //         .expect(HTTP_STATUSES.NO_CONTENT_204)
    //   })

    //   it('+ POST login fifth user', async () => {
    //     const res = await request(httpServer)
    //     .post(`/${RouterPaths.auth}/login`)
    //     .send({
    //         loginOrEmail: "FifthUser",
    //         password: "123456"
    //     })
    //     .expect(HTTP_STATUSES.OK_200)
    //     fifthAccessToken = res.body.accessToken
    //   })

      it('+ POST create first blog by first user', async () => {
        const res = await request(httpServer)
        .post(`/${RouterPaths.blogger}/blogs`)
        .set('Authorization', `Bearer ${firstAccessToken}`)
        .send({
            "name":"1b 1u",
            "description": "some description",
            "websiteUrl": "https://h-KzI7JKEy0ieStV8bjmlVpi80chh-A.com"
        })
        .expect(HTTP_STATUSES.CREATED_201)
        firstUserFirstBlogId = res.body.id;
      })

      it('+ POST create second blog by first user', async () => {
        const res = await request(httpServer)
        .post(`/${RouterPaths.blogger}/blogs`)
        .set('Authorization', `Bearer ${firstAccessToken}`)
        .send({
            "name":"2b 1u",
            "description": "some description",
            "websiteUrl": "https://h-KzI7JKEy0ieStV8bjmlVpi80chh-A.com"
        })
        .expect(HTTP_STATUSES.CREATED_201)
        firstUserSecondBlogId = res.body.id;
      })

      it('+ POST create third blog by first user', async () => {
        const res = await request(httpServer)
        .post(`/${RouterPaths.blogger}/blogs`)
        .set('Authorization', `Bearer ${firstAccessToken}`)
        .send({
            "name":"3b 1u",
            "description": "some description",
            "websiteUrl": "https://h-KzI7JKEy0ieStV8bjmlVpi80chh-A.com"
        })
        .expect(HTTP_STATUSES.CREATED_201)
        firstUserThirdBlogId = res.body.id;
      })

      it('+ POST create fourth blog by first user', async () => {
        const res = await request(httpServer)
        .post(`/${RouterPaths.blogger}/blogs`)
        .set('Authorization', `Bearer ${firstAccessToken}`)
        .send({
            "name":"4b 1u",
            "description": "some description",
            "websiteUrl": "https://h-KzI7JKEy0ieStV8bjmlVpi80chh-A.com"
        })
        .expect(HTTP_STATUSES.CREATED_201)
        firstUserFourthBlogId = res.body.id;
      })

      it('+ POST create fifth blog by first user', async () => {
        const res = await request(httpServer)
        .post(`/${RouterPaths.blogger}/blogs`)
        .set('Authorization', `Bearer ${firstAccessToken}`)
        .send({
            "name":"5b 1u",
            "description": "some description",
            "websiteUrl": "https://h-KzI7JKEy0ieStV8bjmlVpi80chh-A.com"
        })
        .expect(HTTP_STATUSES.CREATED_201)
        firstUserFifthBlogId = res.body.id;
      })

      it('+ POST create sixth blog by first user', async () => {
        const res = await request(httpServer)
        .post(`/${RouterPaths.blogger}/blogs`)
        .set('Authorization', `Bearer ${firstAccessToken}`)
        .send({
            "name":"6b 1u",
            "description": "some description",
            "websiteUrl": "https://h-KzI7JKEy0ieStV8bjmlVpi80chh-A.com"
        })
        .expect(HTTP_STATUSES.CREATED_201)
        firstUserSixthBlogId = res.body.id;
      })

      it('+ Second user subscribes the first blog of first user', async () => {
        const res = await request(httpServer)
        .post(`/blogs/${firstUserFirstBlogId}/subscription`)
        .set('Authorization', `Bearer ${secondAccessToken}`)
        .expect(HTTP_STATUSES.NO_CONTENT_204)
      })

      it('+ Second user subscribes the third blog of first user', async () => {
        const res = await request(httpServer)
        .post(`/blogs/${firstUserThirdBlogId}/subscription`)
        .set('Authorization', `Bearer ${secondAccessToken}`)
        .expect(HTTP_STATUSES.NO_CONTENT_204)
      })
      
      it('+ Second user subscribes the fifth blog of first user', async () => {
        const res = await request(httpServer)
        .post(`/blogs/${firstUserFifthBlogId}/subscription`)
        .set('Authorization', `Bearer ${secondAccessToken}`)
        .expect(HTTP_STATUSES.NO_CONTENT_204)
      })

      it('+ Third user subscribes the first blog of first user', async () => {
        const res = await request(httpServer)
        .post(`/blogs/${firstUserFirstBlogId}/subscription`)
        .set('Authorization', `Bearer ${thirdAccessToken}`)
        .expect(HTTP_STATUSES.NO_CONTENT_204)
      })

      it('+ Third user subscribes the third blog of first user', async () => {
        const res = await request(httpServer)
        .post(`/blogs/${firstUserThirdBlogId}/subscription`)
        .set('Authorization', `Bearer ${thirdAccessToken}`)
        .expect(HTTP_STATUSES.NO_CONTENT_204)
      })

      it('+ Third user subscribes the sixth blog of first user', async () => {
        const res = await request(httpServer)
        .post(`/blogs/${firstUserSixthBlogId}/subscription`)
        .set('Authorization', `Bearer ${thirdAccessToken}`)
        .expect(HTTP_STATUSES.NO_CONTENT_204)
      })

      it('+ Second user unsubscribes the third blog of first user', async () => {
        const res = await request(httpServer)
        .delete(`/blogs/${firstUserThirdBlogId}/subscription`)
        .set('Authorization', `Bearer ${secondAccessToken}`)
        .expect(HTTP_STATUSES.NO_CONTENT_204)
      })

      it('+ Get blogs by second user', async () => {
        const res = await request(httpServer)
        .get(`/blogs`)
        .set('Authorization', `Bearer ${secondAccessToken}`)
        .expect(HTTP_STATUSES.OK_200)
      })


      // it('+ POST create blog by second user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.blogger}/blogs`)
      //   .set('Authorization', `Bearer ${secondAccessToken}`)
      //   .send({
      //       "name":"Second Blogger",
      //       "description": "some description",
      //       "websiteUrl": "https://h-KzI7JKEy0ieStV8bjmlVpi80chh-A.com"
      //   })
      //   .expect(HTTP_STATUSES.CREATED_201)
      //   secondUserBlogId = res.body.id;
      // })

      // it('+ POST create blog by third user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.blogger}/blogs`)
      //   .set('Authorization', `Bearer ${thirdAccessToken}`)
      //   .send({
      //       "name":"Third Blogger",
      //       "description": "some description",
      //       "websiteUrl": "https://h-KzI7JKEy0ieStV8bjmlVpi80chh-A.com"
      //   })
      //   .expect(HTTP_STATUSES.CREATED_201)
      //   thirdUserBlogId = res.body.id;
      // })

      // it('+ POST create blog by fourth user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.blogger}/blogs`)
      //   .set('Authorization', `Bearer ${fourthAccessToken}`)
      //   .send({
      //       "name":"Fourth Blogger",
      //       "description": "some description",
      //       "websiteUrl": "https://h-KzI7JKEy0ieStV8bjmlVpi80chh-A.com"
      //   })
      //   .expect(HTTP_STATUSES.CREATED_201)
      //   fourthUserBlogId = res.body.id;
      // })

      // it('+ POST create blog by fifth user', async () => {
      //   const res = await request(httpServer)
      //   .post(`/${RouterPaths.blogger}/blogs`)
      //   .set('Authorization', `Bearer ${fifthAccessToken}`)
      //   .send({
      //       "name":"Fifth Blogger",
      //       "description": "some description",
      //       "websiteUrl": "https://h-KzI7JKEy0ieStV8bjmlVpi80chh-A.com"
      //   })
      //   .expect(HTTP_STATUSES.CREATED_201)
      //   fifthUserBlogId = res.body.id;
      // })

        


      afterAll( async () => {
        console.log("firstAccessToken-->", firstAccessToken);
        console.log("secondAccessToken-->", secondAccessToken);
        console.log("firstUserFirstBlogId-->", firstUserFirstBlogId);
        // console.log("thirdAccessToken-->", thirdAccessToken);
        // console.log("fourthAccessToken-->", fourthAccessToken);
        // console.log("fifthAccessToken-->", fifthAccessToken);
        await app.close();
      })
})

// yarn test:e2e to run all test from test folder
// npm run test:e2e to run all test from test folder
// yarn test:e2e hm_34.e2e-spec.ts to run separate file