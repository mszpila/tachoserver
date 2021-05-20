import * as mongo from 'mongodb';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { UserFacade } from '../../../src/user/domain/UserFacade';
import { moduleInitialization } from './helpers/moduleInit';
import { SampleUser } from '../../sample_data/user/SampleUser';
import { LoginDto } from '../../../src/user/domain/dto/LoginDto';
import { UserDto } from '../../../src/user/domain/dto/UserDto';

let app: INestApplication;
let userFacade: UserFacade;
// let mongodb: MongoClient;

const JohnMarston = SampleUser.sampleNewUser();
const AdrianMonk: UserDto = SampleUser.sampleNewUser({
  id: '851f5ee6-59e3-41ca-942b-943e926e21cf',
  firstName: 'Adrian',
  lastName: 'Monk',
  email: 'a.monk@gmail.com',
  password: '57*-?#xMNL',
});
const AnakinSkywalker: UserDto = SampleUser.sampleNewUser({
  id: '15605809-1557-49fe-a58d-c861d2291689',
  firstName: 'Anakin',
  lastName: 'Skywalker',
  email: 'skywalker@gmail.com',
  password: 'xk&@fqT5h',
});

beforeAll(async () => {
  const module = await moduleInitialization();
  app = module.createNestApplication();
  await app.init();
  userFacade = module.get(UserFacade);
  // mongodb = await module.get(MongoModule);
});

describe('/POST', () => {
  test('successfull registration', async () => {
    await request(app.getHttpServer())
      .post('/users/register')
      .send(JohnMarston)
      .expect(201);
    return await request(app.getHttpServer())
      .get(`/users/${JohnMarston.id}`)
      .send()
      .expect(200)
      .expect({ ...SampleUser.sampleGetUser(JohnMarston) });
  });

  test('successfull log in', async () => {
    return request(app.getHttpServer())
      .post('/users/login')
      .send(new LoginDto(JohnMarston.email, JohnMarston.password))
      .expect(201);
  });
});

describe('/GET', () => {
  test('fetch users sorted and paginated', async () => {
    await userFacade.register(AdrianMonk);
    await userFacade.register(AnakinSkywalker);
    return request(app.getHttpServer())
      .get('/users')
      .query({
        sort: 'fnd',
        offset: 1,
        limit: 1,
      })
      .expect(200)
      .expect([{ ...SampleUser.sampleGetUser(AnakinSkywalker) }]);
  });
});

describe('/PUT', () => {
  test('update user info', async () => {
    await request(app.getHttpServer())
      .put(`/users/${AnakinSkywalker.id}`)
      .send({ firstName: 'Lord', lastName: 'Vader' })
      .expect(200);
    return await request(app.getHttpServer())
      .get(`/users/${AnakinSkywalker.id}`)
      .send()
      .expect(200)
      .expect({
        ...SampleUser.sampleGetUser(AnakinSkywalker),
        firstName: 'Lord',
        lastName: 'Vader',
      });
  });
});

describe('/DELETE', () => {
  test('delete user', async () => {
    await request(app.getHttpServer())
      .del(`/users/${AnakinSkywalker.id}`)
      .expect(200);
    return await request(app.getHttpServer())
      .get(`/users/${AnakinSkywalker.id}`)
      .expect(404);
  });
});

afterAll(async () => {
  // mongodb.db('tachotestUser').dropDatabase();
  (
    await mongo.connect('mongodb://localhost', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  )
    .db('tachotestUser')
    .dropDatabase();
  await app.close();
});
