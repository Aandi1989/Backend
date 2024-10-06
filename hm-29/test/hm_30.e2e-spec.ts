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

      let firstAccessToken, secondAccessToken, thirdAccessToken, fourthAccessToken,
        firstUserBlogId, secondUserBlogId, thirdUserBlogId, fourthUserBlogId,
        firstPostFirstUserId, secondPostFirstUserId,
        firstPostSecondUserId, secondPostSecondUserId,
        firstPostThirdUserId, secondPostThirdUserId,
        firstPostFourthUserId, secondPostFourthUserId,
        firstCommentFirstUserId, secondCommentFirstUserId,
        thirdCommentFirstUserId, fourthCommentFirstUserId,
        fifthCommentFirstUserId, sixthCommentFirstUserId,
        firstCommentSecondUserId, secondCommentSecondUserId,
        thirdCommentSecondUserId, fourthCommentSecondUserId,
        fifthCommentSecondUserId, sixthCommentSecondUserId,
        firstCommentThirdUserId, secondCommentThirdUserId,
        thirdCommentThirdUserId, fourthCommentThirdUserId,
        fifthCommentThirdUserId, sixthCommentThirdUserId,
        firstCommentFourthUserId, secondCommentFourthUserId,
        thirdCommentFourthUserId, fourthCommentFourthUserId,
        fifthCommentFourthUserId, sixthCommentFourthUserId
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

     it('+ POST create first post for first user', async () => {
        const res = await request(httpServer)
        .post(`/${RouterPaths.blogger}/blogs/${firstUserBlogId}/posts`)
        .set('Authorization', `Bearer ${firstAccessToken}`)
        .send({
          "title": "First Post of First Blogger",
          "shortDescription": "Super description",
          "content": "Super cool content",
          "blogName": "First Blogger"
        })
        .expect(HTTP_STATUSES.CREATED_201)
        firstPostFirstUserId = res.body.id;
     })   

      it('+ POST create second post for first user', async () => {
        const res = await request(httpServer)
        .post(`/${RouterPaths.blogger}/blogs/${firstUserBlogId}/posts`)
        .set('Authorization', `Bearer ${firstAccessToken}`)
        .send({
          "title": "Second Post of First Blogger",
          "shortDescription": "Super description",
          "content": "Super cool content",
          "blogName": "First Blogger"
        })
        .expect(HTTP_STATUSES.CREATED_201)
        secondPostFirstUserId = res.body.id;
    })   

        it('+ POST create first post for second user', async () => {
          const res = await request(httpServer)
          .post(`/${RouterPaths.blogger}/blogs/${secondUserBlogId}/posts`)
          .set('Authorization', `Bearer ${secondAccessToken}`)
          .send({
            "title": "First Post of Second Blogger",
            "shortDescription": "Super description",
            "content": "Super cool content",
            "blogName": "Second Blogger"
          })
          .expect(HTTP_STATUSES.CREATED_201)
          firstPostSecondUserId = res.body.id;
      })   

      it('+ POST create second post for second user', async () => {
        const res = await request(httpServer)
        .post(`/${RouterPaths.blogger}/blogs/${secondUserBlogId}/posts`)
        .set('Authorization', `Bearer ${secondAccessToken}`)
        .send({
          "title": "Second Post of Second Blogger",
          "shortDescription": "Super description",
          "content": "Super cool content",
          "blogName": "Second Blogger"
        })
        .expect(HTTP_STATUSES.CREATED_201)
        secondPostSecondUserId = res.body.id;
      })   

      it('+ POST create first post for third user', async () => {
        const res = await request(httpServer)
        .post(`/${RouterPaths.blogger}/blogs/${thirdUserBlogId}/posts`)
        .set('Authorization', `Bearer ${thirdAccessToken}`)
        .send({
          "title": "First Post of Third Blogger",
          "shortDescription": "Super description",
          "content": "Super cool content",
          "blogName": "Third Blogger"
        })
        .expect(HTTP_STATUSES.CREATED_201)
        firstPostThirdUserId = res.body.id;
    })   

    it('+ POST create second post for third user', async () => {
      const res = await request(httpServer)
      .post(`/${RouterPaths.blogger}/blogs/${thirdUserBlogId}/posts`)
      .set('Authorization', `Bearer ${thirdAccessToken}`)
      .send({
        "title": "Second Post of Third Blogger",
        "shortDescription": "Super description",
        "content": "Super cool content",
        "blogName": "Third Blogger"
      })
      .expect(HTTP_STATUSES.CREATED_201)
      secondPostThirdUserId = res.body.id;
    })   

    it('+ POST create first post for fourth user', async () => {
      const res = await request(httpServer)
      .post(`/${RouterPaths.blogger}/blogs/${fourthUserBlogId}/posts`)
      .set('Authorization', `Bearer ${fourthAccessToken}`)
      .send({
        "title": "First Post of Fourth Blogger",
        "shortDescription": "Super description",
        "content": "Super cool content",
        "blogName": "Fourth Blogger"
      })
      .expect(HTTP_STATUSES.CREATED_201)
      firstPostFourthUserId = res.body.id;
  })   

  it('+ POST create second post for fouth user', async () => {
    const res = await request(httpServer)
    .post(`/${RouterPaths.blogger}/blogs/${fourthUserBlogId}/posts`)
    .set('Authorization', `Bearer ${fourthAccessToken}`)
    .send({
      "title": "Second Post of Fourth Blogger",
      "shortDescription": "Super description",
      "content": "Super cool content",
      "blogName": "Fourth Blogger"
    })
    .expect(HTTP_STATUSES.CREATED_201)
    secondPostFourthUserId = res.body.id;
  })

  // ===== first user's comments ==========

  it('+ POST create first comment of first user', async () => {
    const res = await request(httpServer)
    .post(`/posts/${firstPostSecondUserId}/comments`)
    .set('Authorization', `Bearer ${firstAccessToken}`)
    .send({
      "content": "Comment of first user for first post of second user"
    })
    .expect(HTTP_STATUSES.CREATED_201)
    firstCommentFirstUserId = res.body.id;
  })

  it('+ POST create second comment of first user', async () => {
    const res = await request(httpServer)
    .post(`/posts/${secondPostSecondUserId}/comments`)
    .set('Authorization', `Bearer ${firstAccessToken}`)
    .send({
      "content": "Comment of first user for second post of second user"
    })
    .expect(HTTP_STATUSES.CREATED_201)
    secondCommentFirstUserId = res.body.id;
  })

  it('+ POST create third comment of first user', async () => {
    const res = await request(httpServer)
    .post(`/posts/${firstPostThirdUserId}/comments`)
    .set('Authorization', `Bearer ${firstAccessToken}`)
    .send({
      "content": "Comment of first user for first post of third user"
    })
    .expect(HTTP_STATUSES.CREATED_201)
    thirdCommentFirstUserId = res.body.id;
  })

  it('+ POST create fourth comment of first user', async () => {
    const res = await request(httpServer)
    .post(`/posts/${secondPostThirdUserId}/comments`)
    .set('Authorization', `Bearer ${firstAccessToken}`)
    .send({
      "content": "Comment of first user for second post of third user"
    })
    .expect(HTTP_STATUSES.CREATED_201)
    fourthCommentFirstUserId = res.body.id;
  })

  it('+ POST create fifth comment of first user', async () => {
    const res = await request(httpServer)
    .post(`/posts/${firstPostFourthUserId}/comments`)
    .set('Authorization', `Bearer ${firstAccessToken}`)
    .send({
      "content": "Comment of first user for first post of fourth user"
    })
    .expect(HTTP_STATUSES.CREATED_201)
    fifthCommentFirstUserId = res.body.id;
  })

  it('+ POST create sixth comment of first user', async () => {
    const res = await request(httpServer)
    .post(`/posts/${secondPostFourthUserId}/comments`)
    .set('Authorization', `Bearer ${firstAccessToken}`)
    .send({
      "content": "Comment of first user for second post of fourth user"
    })
    .expect(HTTP_STATUSES.CREATED_201)
    sixthCommentFirstUserId = res.body.id;
  })

    // ===== second user's comments ==========

    it('+ POST create first comment of second user', async () => {
      const res = await request(httpServer)
      .post(`/posts/${firstPostFirstUserId}/comments`)
      .set('Authorization', `Bearer ${secondAccessToken}`)
      .send({
        "content": "Comment of second user for first post of first user"
      })
      .expect(HTTP_STATUSES.CREATED_201)
      firstCommentSecondUserId = res.body.id;
    })

    it('+ POST create second comment of second user', async () => {
      const res = await request(httpServer)
      .post(`/posts/${secondPostFirstUserId}/comments`)
      .set('Authorization', `Bearer ${secondAccessToken}`)
      .send({
        "content": "Comment of second user for second post of first user"
      })
      .expect(HTTP_STATUSES.CREATED_201)
      secondCommentSecondUserId = res.body.id;
    })

    it('+ POST create third comment of second user', async () => {
      const res = await request(httpServer)
      .post(`/posts/${firstPostThirdUserId}/comments`)
      .set('Authorization', `Bearer ${secondAccessToken}`)
      .send({
        "content": "Comment of second user for first post of third user"
      })
      .expect(HTTP_STATUSES.CREATED_201)
      thirdCommentSecondUserId = res.body.id;
    })

    it('+ POST create fourth comment of second user', async () => {
      const res = await request(httpServer)
      .post(`/posts/${secondPostThirdUserId}/comments`)
      .set('Authorization', `Bearer ${secondAccessToken}`)
      .send({
        "content": "Comment of second user for second post of third user"
      })
      .expect(HTTP_STATUSES.CREATED_201)
      fourthCommentSecondUserId = res.body.id;
    })

    it('+ POST create fifth comment of second user', async () => {
      const res = await request(httpServer)
      .post(`/posts/${firstPostFourthUserId}/comments`)
      .set('Authorization', `Bearer ${secondAccessToken}`)
      .send({
        "content": "Comment of second user for first post of fourth user"
      })
      .expect(HTTP_STATUSES.CREATED_201)
      fifthCommentSecondUserId = res.body.id;
    })

    it('+ POST create sixth comment of second user', async () => {
      const res = await request(httpServer)
      .post(`/posts/${secondPostFourthUserId}/comments`)
      .set('Authorization', `Bearer ${secondAccessToken}`)
      .send({
        "content": "Comment of second user for second post of fourth user"
      })
      .expect(HTTP_STATUSES.CREATED_201)
      sixthCommentSecondUserId = res.body.id;
    })

    // ===== third user's comments ==========

    it('+ POST create first comment of third user', async () => {
      const res = await request(httpServer)
      .post(`/posts/${firstPostFirstUserId}/comments`)
      .set('Authorization', `Bearer ${thirdAccessToken}`)
      .send({
        "content": "Comment of third user for first post of first user"
      })
      .expect(HTTP_STATUSES.CREATED_201)
      firstCommentThirdUserId = res.body.id;
    })

    it('+ POST create second comment of third user', async () => {
      const res = await request(httpServer)
      .post(`/posts/${secondPostFirstUserId}/comments`)
      .set('Authorization', `Bearer ${thirdAccessToken}`)
      .send({
        "content": "Comment of third user for second post of first user"
      })
      .expect(HTTP_STATUSES.CREATED_201)
      secondCommentThirdUserId = res.body.id;
    })

    it('+ POST create third comment of third user', async () => {
      const res = await request(httpServer)
      .post(`/posts/${firstPostSecondUserId}/comments`)
      .set('Authorization', `Bearer ${thirdAccessToken}`)
      .send({
        "content": "Comment of third user for first post of second user"
      })
      .expect(HTTP_STATUSES.CREATED_201)
      thirdCommentThirdUserId = res.body.id;
    })

    it('+ POST create fourth comment of third user', async () => {
      const res = await request(httpServer)
      .post(`/posts/${secondPostSecondUserId}/comments`)
      .set('Authorization', `Bearer ${thirdAccessToken}`)
      .send({
        "content": "Comment of third user for second post of second user"
      })
      .expect(HTTP_STATUSES.CREATED_201)
      fourthCommentThirdUserId = res.body.id;
    })

    it('+ POST create fifth comment of third user', async () => {
      const res = await request(httpServer)
      .post(`/posts/${firstPostFourthUserId}/comments`)
      .set('Authorization', `Bearer ${thirdAccessToken}`)
      .send({
        "content": "Comment of third user for first post of fourth user"
      })
      .expect(HTTP_STATUSES.CREATED_201)
      fifthCommentThirdUserId = res.body.id;
    })

    it('+ POST create sixth comment of third user', async () => {
      const res = await request(httpServer)
      .post(`/posts/${secondPostFourthUserId}/comments`)
      .set('Authorization', `Bearer ${thirdAccessToken}`)
      .send({
        "content": "Comment of third user for second post of fourth user"
      })
      .expect(HTTP_STATUSES.CREATED_201)
      sixthCommentThirdUserId = res.body.id;
    })

        // ===== fourth user's comments ==========

    it('+ POST create first comment of fourth user', async () => {
      const res = await request(httpServer)
      .post(`/posts/${firstPostFirstUserId}/comments`)
      .set('Authorization', `Bearer ${fourthAccessToken}`)
      .send({
        "content": "Comment of fourth user for first post of first user"
      })
      .expect(HTTP_STATUSES.CREATED_201)
      firstCommentFourthUserId = res.body.id;
    })

    it('+ POST create second comment of fourth user', async () => {
      const res = await request(httpServer)
      .post(`/posts/${secondPostFirstUserId}/comments`)
      .set('Authorization', `Bearer ${fourthAccessToken}`)
      .send({
        "content": "Comment of fourth user for second post of first user"
      })
      .expect(HTTP_STATUSES.CREATED_201)
      secondCommentFourthUserId = res.body.id;
    })

    it('+ POST create third comment of fourth user', async () => {
      const res = await request(httpServer)
      .post(`/posts/${firstPostSecondUserId}/comments`)
      .set('Authorization', `Bearer ${fourthAccessToken}`)
      .send({
        "content": "Comment of fourth user for first post of second user"
      })
      .expect(HTTP_STATUSES.CREATED_201)
      thirdCommentFourthUserId = res.body.id;
    })

    it('+ POST create fourth comment of fourth user', async () => {
      const res = await request(httpServer)
      .post(`/posts/${secondPostSecondUserId}/comments`)
      .set('Authorization', `Bearer ${fourthAccessToken}`)
      .send({
        "content": "Comment of fourth user for second post of second user"
      })
      .expect(HTTP_STATUSES.CREATED_201)
      fourthCommentFourthUserId = res.body.id;
    })

    it('+ POST create fifth comment of fourth user', async () => {
      const res = await request(httpServer)
      .post(`/posts/${firstPostThirdUserId}/comments`)
      .set('Authorization', `Bearer ${fourthAccessToken}`)
      .send({
        "content": "Comment of fourth user for first post of third user"
      })
      .expect(HTTP_STATUSES.CREATED_201)
      fifthCommentFourthUserId = res.body.id;
    })

    it('+ POST create sixth comment of fourth user', async () => {
      const res = await request(httpServer)
      .post(`/posts/${secondPostThirdUserId}/comments`)
      .set('Authorization', `Bearer ${fourthAccessToken}`)
      .send({
        "content": "Comment of fourth user for second post of third user"
      })
      .expect(HTTP_STATUSES.CREATED_201)
      sixthCommentFourthUserId = res.body.id;
    })

    // ===== like posts

    it('+ POST like post by first user', async () => {
      const res = await request(httpServer)
      .put(`/posts/${firstPostSecondUserId}/like-status`)
      .set('Authorization', `Bearer ${firstAccessToken}`)
      .send({likeStatus: "Like"})
      .expect(HTTP_STATUSES.NO_CONTENT_204)
    })

    it('+ POST like post by first user', async () => {
      const res = await request(httpServer)
      .put(`/posts/${firstPostThirdUserId}/like-status`)
      .set('Authorization', `Bearer ${firstAccessToken}`)
      .send({likeStatus: "Like"})
      .expect(HTTP_STATUSES.NO_CONTENT_204)
    })

    it('+ POST like post by first user', async () => {
      const res = await request(httpServer)
      .put(`/posts/${firstPostFourthUserId}/like-status`)
      .set('Authorization', `Bearer ${firstAccessToken}`)
      .send({likeStatus: "Like"})
      .expect(HTTP_STATUSES.NO_CONTENT_204)
    })

    it('+ POST like post by second user', async () => {
      const res = await request(httpServer)
      .put(`/posts/${firstPostFirstUserId}/like-status`)
      .set('Authorization', `Bearer ${secondAccessToken}`)
      .send({likeStatus: "Like"})
      .expect(HTTP_STATUSES.NO_CONTENT_204)
    })

    it('+ POST like post by second user', async () => {
      const res = await request(httpServer)
      .put(`/posts/${firstPostThirdUserId}/like-status`)
      .set('Authorization', `Bearer ${secondAccessToken}`)
      .send({likeStatus: "Like"})
      .expect(HTTP_STATUSES.NO_CONTENT_204)
    })

    it('+ POST like post by second user', async () => {
      const res = await request(httpServer)
      .put(`/posts/${firstPostFourthUserId}/like-status`)
      .set('Authorization', `Bearer ${secondAccessToken}`)
      .send({likeStatus: "Like"})
      .expect(HTTP_STATUSES.NO_CONTENT_204)
    })

    it('+ POST like post by third user', async () => {
      const res = await request(httpServer)
      .put(`/posts/${firstPostFirstUserId}/like-status`)
      .set('Authorization', `Bearer ${thirdAccessToken}`)
      .send({likeStatus: "Like"})
      .expect(HTTP_STATUSES.NO_CONTENT_204)
    })

    it('+ POST like post by third user', async () => {
      const res = await request(httpServer)
      .put(`/posts/${firstPostSecondUserId}/like-status`)
      .set('Authorization', `Bearer ${thirdAccessToken}`)
      .send({likeStatus: "Like"})
      .expect(HTTP_STATUSES.NO_CONTENT_204)
    })

    it('+ POST like post by third user', async () => {
      const res = await request(httpServer)
      .put(`/posts/${firstPostFourthUserId}/like-status`)
      .set('Authorization', `Bearer ${thirdAccessToken}`)
      .send({likeStatus: "Like"})
      .expect(HTTP_STATUSES.NO_CONTENT_204)
    })

    it('+ POST like post by fourth user', async () => {
      const res = await request(httpServer)
      .put(`/posts/${firstPostFirstUserId}/like-status`)
      .set('Authorization', `Bearer ${fourthAccessToken}`)
      .send({likeStatus: "Like"})
      .expect(HTTP_STATUSES.NO_CONTENT_204)
    })

    it('+ POST like post by fourth user', async () => {
      const res = await request(httpServer)
      .put(`/posts/${firstPostSecondUserId}/like-status`)
      .set('Authorization', `Bearer ${fourthAccessToken}`)
      .send({likeStatus: "Like"})
      .expect(HTTP_STATUSES.NO_CONTENT_204)
    })

    it('+ POST like post by fourth user', async () => {
      const res = await request(httpServer)
      .put(`/posts/${firstPostThirdUserId}/like-status`)
      .set('Authorization', `Bearer ${fourthAccessToken}`)
      .send({likeStatus: "Like"})
      .expect(HTTP_STATUSES.NO_CONTENT_204)
    })

    // ===== like comments

    it('+ POST like comment by first user', async () => {
      const res = await request(httpServer)
      .put(`/comments/${firstCommentSecondUserId}/like-status`)
      .set('Authorization', `Bearer ${firstAccessToken}`)
      .send({likeStatus: "Like"})
      .expect(HTTP_STATUSES.NO_CONTENT_204)
    })

    it('+ POST like comment by first user', async () => {
      const res = await request(httpServer)
      .put(`/comments/${firstCommentThirdUserId}/like-status`)
      .set('Authorization', `Bearer ${firstAccessToken}`)
      .send({likeStatus: "Like"})
      .expect(HTTP_STATUSES.NO_CONTENT_204)
    })

    it('+ POST like comment by first user', async () => {
      const res = await request(httpServer)
      .put(`/comments/${firstCommentFourthUserId}/like-status`)
      .set('Authorization', `Bearer ${firstAccessToken}`)
      .send({likeStatus: "Like"})
      .expect(HTTP_STATUSES.NO_CONTENT_204)
    })

    it('+ POST like comment by second user', async () => {
      const res = await request(httpServer)
      .put(`/comments/${firstCommentFirstUserId}/like-status`)
      .set('Authorization', `Bearer ${secondAccessToken}`)
      .send({likeStatus: "Like"})
      .expect(HTTP_STATUSES.NO_CONTENT_204)
    })

    it('+ POST like comment by second user', async () => {
      const res = await request(httpServer)
      .put(`/comments/${firstCommentThirdUserId}/like-status`)
      .set('Authorization', `Bearer ${secondAccessToken}`)
      .send({likeStatus: "Like"})
      .expect(HTTP_STATUSES.NO_CONTENT_204)
    })

    it('+ POST like comment by second user', async () => {
      const res = await request(httpServer)
      .put(`/comments/${firstCommentFourthUserId}/like-status`)
      .set('Authorization', `Bearer ${secondAccessToken}`)
      .send({likeStatus: "Like"})
      .expect(HTTP_STATUSES.NO_CONTENT_204)
    })

    it('+ POST like comment by third user', async () => {
      const res = await request(httpServer)
      .put(`/comments/${firstCommentFirstUserId}/like-status`)
      .set('Authorization', `Bearer ${thirdAccessToken}`)
      .send({likeStatus: "Like"})
      .expect(HTTP_STATUSES.NO_CONTENT_204)
    })

    it('+ POST like comment by third user', async () => {
      const res = await request(httpServer)
      .put(`/comments/${firstCommentSecondUserId}/like-status`)
      .set('Authorization', `Bearer ${thirdAccessToken}`)
      .send({likeStatus: "Like"})
      .expect(HTTP_STATUSES.NO_CONTENT_204)
    })

    it('+ POST like comment by third user', async () => {
      const res = await request(httpServer)
      .put(`/comments/${firstCommentFourthUserId}/like-status`)
      .set('Authorization', `Bearer ${thirdAccessToken}`)
      .send({likeStatus: "Like"})
      .expect(HTTP_STATUSES.NO_CONTENT_204)
    })

    it('+ POST like comment by fourth user', async () => {
      const res = await request(httpServer)
      .put(`/comments/${firstCommentFirstUserId}/like-status`)
      .set('Authorization', `Bearer ${fourthAccessToken}`)
      .send({likeStatus: "Dislike"})
      .expect(HTTP_STATUSES.NO_CONTENT_204)
    })

    it('+ POST like comment by fourth user', async () => {
      const res = await request(httpServer)
      .put(`/comments/${firstCommentSecondUserId}/like-status`)
      .set('Authorization', `Bearer ${fourthAccessToken}`)
      .send({likeStatus: "Dislike"})
      .expect(HTTP_STATUSES.NO_CONTENT_204)
    })

    it('+ POST like comment by fourth user', async () => {
      const res = await request(httpServer)
      .put(`/comments/${firstCommentThirdUserId}/like-status`)
      .set('Authorization', `Bearer ${fourthAccessToken}`)
      .send({likeStatus: "Dislike"})
      .expect(HTTP_STATUSES.NO_CONTENT_204)
    })



      afterAll( async () => {
        console.log("firstAccessToken-->", firstAccessToken);
        console.log("secondAccessToken-->", secondAccessToken);
        console.log("thirdAccessToken-->", thirdAccessToken);
        console.log("fourthAccessToken-->", fourthAccessToken);
        await app.close();
      })
})

// yarn test:e2e to run all test from test folder
// npm run test:e2e to run all test from test folder
// yarn test:e2e hm_30.e2e-spec.ts to run separate file