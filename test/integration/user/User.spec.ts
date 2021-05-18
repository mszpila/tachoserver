import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { UserFacade } from '../../../src/user/domain/UserFacade';
import { moduleInitialization } from './helpers/moduleInit';

let app: INestApplication;
let userFacade: UserFacade;

beforeAll(async () => {
  const module = await moduleInitialization();
  app = module.createNestApplication();
  userFacade = module.get(UserFacade);
});

describe('User', () => {
  // it(`/GET cats`, () => {
  //   return request(app.getHttpServer()).get('/cats').expect(200).expect({
  //     data: true,
  //   });
  // });

  it('/GET users', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect('Hello World!');
  });
});

afterAll(async () => {
  await app.close();
});
