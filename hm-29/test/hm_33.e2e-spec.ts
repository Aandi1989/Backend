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
        firstUserBlogId, secondUserBlogId, thirdUserBlogId, fourthUserBlogId, fifthUserBlogId
        
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

      it('+ POST login fourth user', async () => {
        const res = await request(httpServer)
        .post(`/${RouterPaths.auth}/login`)
        .send({
            loginOrEmail: "FourthUser",
            password: "123456"
        })
        .expect(HTTP_STATUSES.OK_200)
        fourthAccessToken = res.body.accessToken
      })

      it('+ POST registration of the fifth user', async () => {
        return request(httpServer)
            .post(`/${RouterPaths.auth}/registration`)
            .send({
                login: "FifthUser",
                password: "123456",
                email: "fifthUser@mail.com"
            })
            .expect(HTTP_STATUSES.NO_CONTENT_204)
      })

      it('+ POST login fifth user', async () => {
        const res = await request(httpServer)
        .post(`/${RouterPaths.auth}/login`)
        .send({
            loginOrEmail: "FifthUser",
            password: "123456"
        })
        .expect(HTTP_STATUSES.OK_200)
        fifthAccessToken = res.body.accessToken
      })

      it('+ POST create blog by first user', async () => {
        const res = await request(httpServer)
        .post(`/${RouterPaths.blogger}/blogs`)
        .set('Authorization', `Bearer ${firstAccessToken}`)
        .send({
            "name":"First Blogger",
            "description": "some description",
            "websiteUrl": "https://h-KzI7JKEy0ieStV8bjmlVpi80chh-A.com"
        })
        .expect(HTTP_STATUSES.CREATED_201)
        firstUserBlogId = res.body.id;
      })

      it('+ POST create blog by second user', async () => {
        const res = await request(httpServer)
        .post(`/${RouterPaths.blogger}/blogs`)
        .set('Authorization', `Bearer ${secondAccessToken}`)
        .send({
            "name":"Second Blogger",
            "description": "some description",
            "websiteUrl": "https://h-KzI7JKEy0ieStV8bjmlVpi80chh-A.com"
        })
        .expect(HTTP_STATUSES.CREATED_201)
        secondUserBlogId = res.body.id;
      })

      it('+ POST create blog by third user', async () => {
        const res = await request(httpServer)
        .post(`/${RouterPaths.blogger}/blogs`)
        .set('Authorization', `Bearer ${thirdAccessToken}`)
        .send({
            "name":"Third Blogger",
            "description": "some description",
            "websiteUrl": "https://h-KzI7JKEy0ieStV8bjmlVpi80chh-A.com"
        })
        .expect(HTTP_STATUSES.CREATED_201)
        thirdUserBlogId = res.body.id;
      })

      it('+ POST create blog by fourth user', async () => {
        const res = await request(httpServer)
        .post(`/${RouterPaths.blogger}/blogs`)
        .set('Authorization', `Bearer ${fourthAccessToken}`)
        .send({
            "name":"Fourth Blogger",
            "description": "some description",
            "websiteUrl": "https://h-KzI7JKEy0ieStV8bjmlVpi80chh-A.com"
        })
        .expect(HTTP_STATUSES.CREATED_201)
        fourthUserBlogId = res.body.id;
      })

      it('+ POST create blog by fifth user', async () => {
        const res = await request(httpServer)
        .post(`/${RouterPaths.blogger}/blogs`)
        .set('Authorization', `Bearer ${fifthAccessToken}`)
        .send({
            "name":"Fifth Blogger",
            "description": "some description",
            "websiteUrl": "https://h-KzI7JKEy0ieStV8bjmlVpi80chh-A.com"
        })
        .expect(HTTP_STATUSES.CREATED_201)
        fifthUserBlogId = res.body.id;
      })

        it('+ POST should upload wallpaper image for first blog', async () => {
            const response = await request(httpServer)
                .post(`/${RouterPaths.blogger}/blogs/${firstUserBlogId}/images/wallpaper`)
                .set('Authorization', `Bearer ${firstAccessToken}`)
                .attach('file', '/home/aliaksandr/Downloads/wallpaper.jpg') 
                .expect(HTTP_STATUSES.CREATED_201); 
        });

        it('+ POST should upload main image for first blog', async () => {
            const response = await request(httpServer)
                .post(`/${RouterPaths.blogger}/blogs/${firstUserBlogId}/images/main`)
                .set('Authorization', `Bearer ${firstAccessToken}`)
                .attach('file', '/home/aliaksandr/Downloads/blogImage.jpg') 
                .expect(HTTP_STATUSES.CREATED_201);
        });

        it('+ POST should upload wallpaper image for second blog', async () => {
            const response = await request(httpServer)
                .post(`/${RouterPaths.blogger}/blogs/${secondUserBlogId}/images/wallpaper`)
                .set('Authorization', `Bearer ${secondAccessToken}`)
                .attach('file', '/home/aliaksandr/Downloads/wallpaper.jpg') 
                .expect(HTTP_STATUSES.CREATED_201); 
        });

        it('+ POST should upload main image for second blog', async () => {
            const response = await request(httpServer)
                .post(`/${RouterPaths.blogger}/blogs/${secondUserBlogId}/images/main`)
                .set('Authorization', `Bearer ${secondAccessToken}`)
                .attach('file', '/home/aliaksandr/Downloads/blogImage.jpg') 
                .expect(HTTP_STATUSES.CREATED_201); 
        });

        it('+ POST should upload wallpaper image for third blog', async () => {
            const response = await request(httpServer)
                .post(`/${RouterPaths.blogger}/blogs/${thirdUserBlogId}/images/wallpaper`)
                .set('Authorization', `Bearer ${thirdAccessToken}`)
                .attach('file', '/home/aliaksandr/Downloads/wallpaper.jpg') 
                .expect(HTTP_STATUSES.CREATED_201); 
        });

        it('+ POST should upload main image for third blog', async () => {
            const response = await request(httpServer)
                .post(`/${RouterPaths.blogger}/blogs/${thirdUserBlogId}/images/main`)
                .set('Authorization', `Bearer ${thirdAccessToken}`)
                .attach('file', '/home/aliaksandr/Downloads/blogImage.jpg') 
                .expect(HTTP_STATUSES.CREATED_201); 
        });

        it('+ POST should upload wallpaper image for fourth blog', async () => {
            const response = await request(httpServer)
                .post(`/${RouterPaths.blogger}/blogs/${fourthUserBlogId}/images/wallpaper`)
                .set('Authorization', `Bearer ${fourthAccessToken}`)
                .attach('file', '/home/aliaksandr/Downloads/wallpaper.jpg') 
                .expect(HTTP_STATUSES.CREATED_201); 
        });

        it('+ POST should upload main image for fourth blog', async () => {
            const response = await request(httpServer)
                .post(`/${RouterPaths.blogger}/blogs/${fourthUserBlogId}/images/main`)
                .set('Authorization', `Bearer ${fourthAccessToken}`)
                .attach('file', '/home/aliaksandr/Downloads/blogImage.jpg') 
                .expect(HTTP_STATUSES.CREATED_201); 
        });

        it('+ POST should upload wallpaper image for fifth blog', async () => {
            const response = await request(httpServer)
                .post(`/${RouterPaths.blogger}/blogs/${fifthUserBlogId}/images/wallpaper`)
                .set('Authorization', `Bearer ${fifthAccessToken}`)
                .attach('file', '/home/aliaksandr/Downloads/wallpaper.jpg') // Path to your test image file
                .expect(HTTP_STATUSES.CREATED_201); // Update according to your expected status
        });

        it('+ POST should upload main image for fifth blog', async () => {
            const response = await request(httpServer)
                .post(`/${RouterPaths.blogger}/blogs/${fifthUserBlogId}/images/main`)
                .set('Authorization', `Bearer ${fifthAccessToken}`)
                .attach('file', '/home/aliaksandr/Downloads/blogImage.jpg') // Path to your test image file
                .expect(HTTP_STATUSES.CREATED_201); // Update according to your expected status
        });


      afterAll( async () => {
        console.log("firstAccessToken-->", firstAccessToken);
        console.log("secondAccessToken-->", secondAccessToken);
        console.log("thirdAccessToken-->", thirdAccessToken);
        console.log("fourthAccessToken-->", fourthAccessToken);
        console.log("fifthAccessToken-->", fifthAccessToken);
        await app.close();
      })
})

// yarn test:e2e to run all test from test folder
// npm run test:e2e to run all test from test folder
// yarn test:e2e hm_33.e2e-spec.ts to run separate file