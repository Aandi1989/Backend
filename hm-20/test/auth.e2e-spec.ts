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

  const user = {
    email: "cat2021@gmail.com",
    login: "Fabi",
    password: "123456"
  } 

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
          { "message": "login must be longer than or equal to 3 characters", "field": "login" },
          { "message": "password must be longer than or equal to 6 characters", "field": "password" },
          { "message": "email must be an email", "field": "email" }]
      })
  })

  it('+ POST successful registration', async () => {
    return request(httpServer)
      .post(`/${RouterPaths.auth}/registration`)
      .send({
        email: `${user.email}`,
        login: `${user.login}`,
        password: `${user.password}`
      })
      .expect(HTTP_STATUSES.NO_CONTENT_204)
  })

  it(`- POST failed email-resending`, async () => {
    return request(httpServer)
    .post(`/${RouterPaths.auth}/registration-email-resending`)
    .send({ email: `incorrect.email@gmail.com` })
    .expect(HTTP_STATUSES.BAD_REQUEST_400)
  })

  it('+ POST successful email-resending', async () => {
    const createdUser = await usersRepository.findOneBy({ email: `${user.email}` });
    const confirmationCode = createdUser!.confirmationCode;

    const res = await request(httpServer)
      .post(`/${RouterPaths.auth}/registration-email-resending`)
      .send({ email: `${createdUser!.email}` })
      .expect(HTTP_STATUSES.NO_CONTENT_204)

    const updatedUser = await usersRepository.findOneBy({ email: `${user.email}` });
    const newConfirmationCode = updatedUser!.confirmationCode

    expect(confirmationCode).not.toEqual(newConfirmationCode)
  })

  it('- POST failed registration-confirmation', async () => {
    const createdUser = await usersRepository.findOneBy({ email: `${user.email}` });

    const res = await request(httpServer)
      .post(`/${RouterPaths.auth}/registration-confirmation`)
      .send({ code: 'random-code'})
      .expect(HTTP_STATUSES.BAD_REQUEST_400)
  })

  it('+ POST successful registration-confirmation', async () => {
    const createdUser = await usersRepository.findOneBy({ email: `${user.email}` });

    const res = await request(httpServer)
      .post(`/${RouterPaths.auth}/registration-confirmation`)
      .send({ code: `${createdUser!.confirmationCode}`})
      .expect(HTTP_STATUSES.NO_CONTENT_204)
  })

  it('+ POST successful login 5 times during 10 seconds', async () => {
    for(let i = 1; i <= 5; i++){
      let res = await request(httpServer)
        .post(`/${RouterPaths.auth}/login`)
        .send({loginOrEmail: `${user.login}`, password: `${user.password}`})
        .expect(HTTP_STATUSES.OK_200)
    }
  })

  it('- POST 6th failed attempt to login during 10 seconds', async () => {
    let res = await request(httpServer)
        .post(`/${RouterPaths.auth}/login`)
        .send({loginOrEmail: `${user.login}`, password: `${user.password}`})
        .expect(HTTP_STATUSES.TO_MANY_REQUESTS_429)
  })

  it('+ POST successful login after pause of 10 seconds + verification of access and refresh tokens', async () => {
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    return request(httpServer)
      .post(`/${RouterPaths.auth}/login`)
      .send({loginOrEmail: `${user.login}`, password: `${user.password}`})
      .expect(HTTP_STATUSES.OK_200)
      .expect((res) => {
        const cookies = res.headers['set-cookie'];
        expect(cookies).toEqual(expect.arrayContaining([
          expect.stringContaining('refreshToken=')  
        ]));
        expect(res.body).toEqual(expect.objectContaining({"accessToken": expect.any(String)}))
      })
  }, 12000)


  afterAll(async () => {
    await app.close();
  })
});


// yarn test:e2e auth.e2e-spec.ts ---command to run this file
