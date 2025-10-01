import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it ('Get /users/ returns an array of users with an OK status code', async () => {
    const req = await request(app.getHttpServer()).get('/users')
    console.log(req.body);

    expect(req.status).toBe(200);
    expect(req.body).toBeInstanceOf(Array);

  });

  it ('Get /users/:id returns an user with an OK status code', async () => {
    // 8053d562-f069-4ceb-b54a-ff2a50cc3171
    const req = await request(app.getHttpServer()).get('/users/8053d562-f069-4ceb-b54a-ff2a50cc3171')
    console.log(req.body);

    expect(req.status).toBe(200);
    expect(req.body).toBeInstanceOf(Object);
  });

  it ('Get /users/:id throws a NotFoundException if the user doesn\'t exist with a message usuario no encontrado', async () => {
     // 8053d562-f069-4ceb-b54a-ff2a50cc3171
    const req = await request(app.getHttpServer()).get('/users/8053d562-f069-4ceb-b54a-ff2a50cc3172')
    console.log(req.body);

    expect(req.status).toBe(404);
    expect(req.body.message).toBe('usuario no encontrado');
  });

   it ('Get /users/:id throws an error if id is not a UUID', async () => {
     // 8053d562-f069-4ceb-b54a-ff2a50cc3171
    const req = await request(app.getHttpServer()).get(
      '/users/not-a-uuid'
      )
    console.log(req.body);

    expect(req.status).toBe(400);
    expect(req.body).toBeInstanceOf(Object)
  });

  it ('Post /users/ signup creates a user with an OK status code', async () => {

    const req = await request(app.getHttpServer()).post('/users/signup').send({
      email: 'a@b.com',
      password: '1234567',
      name: 'test'
  })
  console.log(req.body);
  expect(req.status).toBe(201);
  expect(req.body).toBeInstanceOf(Object);
  });


});
